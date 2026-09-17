This project started as a team project for my Big Data Engineering course at Boston University. The question was simple: can social media sentiment and engagement about NVIDIA help predict its next-trading-day volume? We pulled posts about NVIDIA from X, combined them with historical NVDA market data, turned the raw data into features, trained a model, and showed the results in Power BI.

I understood the parts I worked on. But after the course ended, I realized that working on a data pipeline and understanding the whole data pipeline are two different things. I couldn't confidently answer questions like: why do I need Bronze, Silver, and Gold layers? Where should transformation happen? How does a tweet get matched to a trading session? How does a trained model become part of a scheduled job? What happens after a prediction is generated? And what changes when something that works in a notebook has to run on its own every day?

So I rebuilt the entire pipeline myself in a fresh Azure environment.

My goal wasn't to maximize model performance or reproduce every detail of the original project. I wanted to build the end-to-end engineering workflow with my own hands and understand why each component existed. That turned out to be a lot more useful than getting another notebook to run.

![Architecture of the rebuilt pipeline. Historical lane: Twitter API through Azure Data Factory into Tweet Bronze and Silver, Yahoo Finance through Synapse Spark into Stock Bronze and Silver, both joined by Synapse Spark into Gold and trained with Spark MLlib into a PipelineModel stored in ADLS. Daily lane: an Azure Function writes Daily Gold at 5 AM, a Synapse prediction pipeline loads the model at 6 AM, and a BackfillRetrain pipeline at 6:30 PM backfills actuals and retrains if needed. Serving: prediction history and Gold aggregates are exposed as external tables, loaded into a Synapse Dedicated SQL Pool, and read by Power BI in Import mode](/img/blogs/azure-pipeline-architecture.svg)

# 1. What I Was Actually Building

At the center is one ML problem: use social activity about NVIDIA to predict trading volume for the next market session. But the model is a small part of the system. Before a prediction is even possible, the system has to collect data, preserve the raw inputs, clean and structure them, align two very different data sources, engineer features, store a model, run inference on a schedule, collect the actual result later, refresh analytical tables, and expose all of it to a dashboard.

I ended up thinking about it as two connected workflows.

**The historical pipeline** builds the training dataset once:

```text
Twitter API ──→ Bronze ──→ Silver ──┐
                                    ├──→ Gold ──→ Feature Engineering ──→ Model
Yahoo Finance → Bronze ──→ Silver ──┘
```

**The daily pipeline** keeps the system alive after the model is trained. It collects the day's data at 5:00 AM ET, predicts at 6:00 AM, waits for the market to close, backfills the actual volume at 6:30 PM, evaluates and retrains if needed, rebuilds the Gold aggregates, and refreshes the warehouse so Power BI has fresh data to pull.

This split was the most important thing I got out of the rebuild. The historical pipeline is about producing reproducible, trustworthy training data. The daily pipeline is about scheduling, state, model serving, feedback, dependencies, failures, and cloud cost. Those are completely different problems, and the second one is where most of my time went.

# 2. The Architecture

I built the system around Azure's data stack:

- **Azure Data Factory** for historical tweet ingestion and the Bronze-to-Silver transformation
- **Azure Data Lake Storage Gen2** for the Bronze, Silver, and Gold layers
- **Azure Synapse Spark** for joins, feature engineering, aggregation, and ML workloads
- **Azure Functions** for lightweight scheduled daily ingestion
- **Spark MLlib** for the prediction pipeline
- **Synapse Dedicated SQL Pool** for the analytical warehouse
- **Power BI** for reporting

There are two paths through this architecture. Historical data goes through the full Bronze → Silver → Gold process. Daily data follows a scheduled micro-batch workflow: an Azure Function collects the day's data, a Synapse pipeline runs the prediction at a fixed time, and another pipeline comes back after the market closes to collect the actual outcome and refresh everything downstream.

I call this micro-batch on purpose, not streaming. The system is automated and processes new data every day, but there's no continuously running consumer handling events one at a time. Rebuilding it made me much more careful about what "real-time" actually means.

# 3. Bronze, Silver, and Gold Are Contracts, Not Folders

Before this project, my mental model of Medallion Architecture was basically Bronze = raw, Silver = cleaned, Gold = ready to use. That's correct, but it misses the point. Once I implemented the layers myself, I started thinking of each one as a different guarantee about the data.

![Medallion data flow: Bronze keeps the raw nested JSON from the API and raw OHLCV rows, Silver flattens both into typed tables, and Gold joins them into one ML-ready observation per tweet with sentiment, engagement, session, and target volume](/img/blogs/medallion-data-flow.svg)

**Bronze answers: can I reproduce what happened?**

Bronze keeps data close to its original source format. For historical tweets, Data Factory calls the API and stores the returned JSON in ADLS under date-based paths:

```text
bronze/
└── tweets/
    ├── 2026/08/14/page_001.json
    ├── 2026/08/15/page_001.json
    ├── ...
    └── 2026/09/15/page_001.json
```

Bronze isn't trying to make the data convenient. Its job is preservation. If I find a bug in my transformation logic later, I reprocess the raw response instead of hoping the external API returns exactly the same data again. That matters a lot when the API has rate limits, costs money, or changes over time.

**Silver answers: can downstream systems trust the structure?**

API responses are designed for API consumers, not for analytics. The tweet response has nested objects and dozens of attributes the rest of my pipeline never uses. The Silver transformation flattens the response into a consistent table with just the fields I need downstream:

```text
tweet_id
created_at
full_text
favorite_count
reply_count
retweet_count
followers_count
friends_count
is_blue_verified
```

Once data reaches Silver, downstream code should never need to know how the API nested those values. If the upstream format changes, the fix lives in one place, the Bronze-to-Silver transformation, instead of in every notebook.

**Gold answers: what does this data mean for my problem?**

Gold is where independently useful datasets become useful together. A tweet doesn't know which NVIDIA trading session it should influence. A stock record doesn't know what people were saying before the market opened. The Gold transformation joins these and produces one ML-ready observation per tweet: sentiment, engagement, account characteristics, the trading session it maps to, and the target market data.

So the three layers aren't three folders with progressively cleaner files. They're progressively stronger guarantees about what the data means and how safely it can be consumed.

# 4. Ingesting and Aligning Two Very Different Sources

**Historical tweets with Data Factory**

Ingestion sounds like `request_tweets(date)` followed by `save_json()`. But once I built it as a pipeline, I had to treat the API as an external system rather than a Python function. The pipeline had to build a different request for each date, pass parameters in safely, preserve the response, and organize the output so later transformations could process it consistently. I used Data Factory for this, parameterized on the date being processed, with each response written straight into Bronze.

I intentionally limited each day to about 20 tweets. The goal wasn't the biggest possible training set. I wanted enough data to exercise every stage of the workflow while keeping API usage and cloud cost reasonable for a personal project.

For Bronze to Silver, I used an ADF Mapping Data Flow to flatten the nested response, pick the attributes I needed, normalize the schema, and write to Silver. This is where the line between orchestration and computation got clear for me. Data Factory is good at moving and reshaping data between sources. Synapse Spark became the better tool once transformations involved joining datasets, feature engineering, and ML logic. Instead of asking which Azure service is "best" for data processing, I started asking which layer owns a transformation and which compute environment makes it easiest to maintain.

**Market data with yfinance**

For NVDA market data, I used Yahoo Finance through `yfinance` inside Synapse Spark. It lives in its own path in the lake:

```text
bronze/
├── tweets/
└── stock/

silver/
├── tweets/
└── stock/
```

The stock pipeline collects daily OHLCV data and writes a consistent Silver dataset. Keeping the two sources separate until Gold was deliberate. At Silver, a tweet is still a tweet and a stock observation is still a stock observation. They only get combined once the system has enough context to know how they relate.

**The hard part: time has business meaning**

Joining tweets and stock data sounds like a normal join. It isn't. Social media exists 24/7 and the stock market doesn't. A tweet posted on Saturday can't join to a Saturday NVDA record because there is no Saturday session. A tweet posted after the prediction cutoff shouldn't influence a prediction that was supposedly generated before it existed.

For the rebuild, I used a 6:00 AM Eastern Time prediction cutoff and mapped social activity to the next available trading session:

1. Convert the tweet timestamp to ET
2. Check whether it falls before or after the cutoff
3. Determine which prediction session it belongs to
4. Map that to the next available trading day
5. Join the market target for that day

A technically valid Spark join can still be conceptually wrong. The pipeline has to respect what information would actually have been available at prediction time. Otherwise it's very easy to leak future information into the training set without noticing.

For weekends and available trading dates, I relied on the market data already in the pipeline. A production version would use a dedicated exchange calendar so holidays and unexpected closures are handled explicitly.

# 5. Features and the Model

Once tweets were mapped to sessions, I could build features that meant more than raw counts. I used VADER for sentiment and added engagement and account-level features:

```text
sentiment_score
interaction_score
favorite_ratio
reply_ratio
followers_count
friends_count
media_count
account_age_days
credibility_score
is_viral
is_blue_verified
is_new_account
is_influencer
is_weekend
day_of_week
```

The interaction score is a hand-picked heuristic:

```text
interaction_score =
    views × 0.1
  + retweets × 2.0
  + replies × 1.5
  + quotes × 1.2
  + favorites
```

The weights aren't learned. The point was to collapse several raw engagement counters into one number that represents relative attention around a tweet. This is also where Gold stops being "cleaned data." Silver contains facts about tweets and market observations. Gold contains features defined specifically for the prediction problem.

For the model, I used Spark MLlib to train a Random Forest regression pipeline on next-session trading volume. Model optimization wasn't the objective here. I collected a much smaller dataset than the original course project on purpose, because I wanted to keep the rebuild cheap and focus on the workflow around the model:

```text
Gold Dataset
     ↓
Feature Pipeline
     ↓
Spark MLlib
     ↓
Persist PipelineModel
     ↓
Scheduled Inference
     ↓
Prediction History
     ↓
Actual Backfill
     ↓
Evaluation
```

I stored the trained `PipelineModel` in ADLS so the daily inference job loads the exact same feature transformations and model. That made the model feel less like notebook output and more like another versioned artifact the pipeline consumes. I also used a time-based split rather than a random one, because the system should learn from the past and be evaluated on what comes later.

# 6. Making It Run Without Me

Getting the historical pipeline working was half the rebuild. The other half started with one question: what would need to happen if this system had to run tomorrow without me opening a notebook?

![Daily orchestration timeline: at 5:00 AM ET an Azure Function collects and preprocesses the day's data, at 6:00 AM ET a Synapse pipeline loads the model and writes a prediction, and at 6:30 PM ET after market close another pipeline backfills the actual volume, evaluates, retrains if needed, rebuilds Gold aggregates, resumes the SQL pool, runs the warehouse refresh, and pauses the pool again](/img/blogs/daily-orchestration.svg)

**5:00 AM ET: an Azure Function collects the day**

For daily ingestion, I used an Azure Function instead of re-running the historical Data Factory workflow. It pulls the day's social and market inputs, does the light preprocessing the daily path needs, and writes to a date-partitioned location under `gold/stream/YYYY/MM/DD/`.

One small but real problem here was daylight saving time. A fixed UTC cron expression doesn't always mean 5:00 AM Eastern. I configured the timer to fire at both possible UTC hours and added an Eastern Time guard inside the Function, so the actual ingestion only runs during the intended local hour. This kind of detail barely exists when you run notebooks by hand. It matters the moment scheduling is part of the system.

**6:00 AM ET: scheduled inference**

A Synapse pipeline runs the prediction notebook. It resolves the current Eastern Time session date, reads the daily Gold data, loads the persisted `PipelineModel`, generates the next-session volume prediction, and writes it back to ADLS as prediction history.

I parameterized the notebook so I can pass a specific session date when testing or backfilling. On scheduled runs the parameter is empty and the notebook derives today's date. Same notebook, two uses: automated daily execution and reproducible manual testing.

**6:30 PM ET: closing the loop**

A prediction isn't the end of the pipeline, because eventually the predicted value becomes observable. After the market closes, another Synapse pipeline retrieves the new market data and fills in the actual outcome for predictions that didn't have a label yet.

This gap between prediction time and label availability was a useful lesson. In a notebook, every row already has a target. In a live system, the label literally doesn't exist when the prediction is made. The data model and the pipeline both have to represent that incomplete state and come back later when the truth shows up.

**Conditional retraining**

Once an actual value is available, the pipeline evaluates the prediction. If the relative error is above a threshold, it retrains and saves a new model. Otherwise it keeps the current one. The threshold is deliberately simple. The point was that training, inference, evaluation, and retraining are different stages with different data dependencies. Retraining doesn't have to happen because a clock says so. It can happen because new information says the current model should be reconsidered.

The Synapse triggers are configured in the Eastern Time zone, so daylight saving is handled there too. At this point the project no longer depends on me opening notebooks in the right order. That was the milestone I cared about most.

# 7. Serving: Gold Aggregates, the Warehouse, and Cost

**Gold isn't one table**

The ML dataset isn't the right dataset for BI. Power BI needed daily sentiment summaries, user profiles, viral tweet stats, market summaries, influencer engagement, and prediction history. So I added a separate Gold aggregation step in Synapse Spark:

```text
gold/aggregates/
├── user_profile/
├── daily_tweet_summary/
├── market_summary_per_day/
├── viral_tweet_log/
├── user_type_distribution_per_day/
├── top_users_by_tweet_count/
├── top_users_by_viral_tweets/
└── influencer_monthly_engagement/
```

The ML pipeline needs feature-oriented data. The dashboard needs aggregates. Both are Gold, because both are consumption-ready, just for different consumers.

**From lake to warehouse**

The data was already queryable in ADLS, so why add a SQL warehouse? Because the lake and the BI serving layer solve different problems. I created external tables over the Gold datasets and built a small dimensional model in a Synapse Dedicated SQL Pool, with `DimDate` and `DimUser` plus fact tables for daily tweet metrics, market summaries, viral tweets, user distributions, influencer engagement, and prediction history. A stored procedure, `sp_DailyRefresh`, rebuilds the warehouse from the latest Gold data.

This gave Power BI clean dimensions and facts instead of asking every visual to interpret raw Parquet or reimplement transformation logic. The split is simple: ADLS stores the data product, the SQL warehouse serves analytical consumers.

**Paying for compute only when I use it**

A Dedicated SQL Pool costs money while it's running, and my dashboard doesn't need a warehouse up 24/7 for a once-a-day refresh. So compute lifecycle became part of the pipeline. The evening orchestration is: backfill actuals, conditional retraining, Gold aggregation, resume the SQL Pool, wait until it reports Online, run `sp_DailyRefresh`, pause the SQL Pool. The resume and pause steps go through Azure Resource Manager using the Synapse workspace's managed identity.

The expensive compute exists only when the workflow needs it. Cost isn't something I calculated after designing the system. It's one of the things the system is explicitly designed to control. For a small portfolio project the savings are nice. For a real production system the principle matters much more.

# 8. What Broke When I Automated It

This was the most educational part of the rebuild. Plenty of things worked when I ran them by hand and broke as soon as I put them in a pipeline.

**`%pip` doesn't exist in pipeline runs**

One notebook installed a dependency with `%pip install yfinance`. That worked interactively. As a pipeline activity it failed:

```text
MagicUsageError: %pip magic command is disabled
```

Removing the magic just moved the failure:

```text
ModuleNotFoundError: No module named 'yfinance'
```

The fix wasn't more notebook edits. I moved `yfinance` into the Spark Pool's package configuration so it's part of the environment for every pipeline-created session. A scheduled job shouldn't depend on an interactive setup step that happened in someone's notebook.

**Compute has state**

My Spark Pool needed the full vCore quota available to the workspace. A failed job would look finished from my side while its resources were still being released, and if I hit Debug again right away, Azure rejected the new session because the old one still held capacity. The fix was to wait until resources actually returned to zero. "Notebook execution ended" and "compute fully released" are not the same event.

**Infrastructure operations are asynchronous**

Resuming the SQL Pool has the same shape. Calling resume doesn't mean SQL is ready. It means Azure starts provisioning, and the pipeline has to poll status until the pool is Online before running anything. Trying to use it while the state was still `Provisioning` produced its own class of errors. The pipeline has to understand resource state, not just activity order. Obvious in hindsight, not obvious when I started.

**Published code is what runs**

Editing a notebook in the Synapse editor doesn't mean the pipeline runs that version. Pipelines execute published artifacts and notebook snapshots. "Publish All" became part of my debugging checklist, because the code in my editor and the artifact actually executing can be two different things.

# 9. The Dashboard

The final layer is Power BI, with two pages.

The first page is an overview of the current prediction and social activity: current stock volume, predicted next-session volume, actual next-session volume once available, sentiment and interaction metrics, verification and account-type distributions, viral tweet counts, and user-level activity.

![Power BI overview page: current stock volume, predicted next-session volume, actual volume and accuracy once available, verification and account-type donuts, tweet and viral tweet counts by user, and average credibility, sentiment, interaction, and follower KPIs](/img/blogs/powerbi-overview.png)

The second page focuses on how sentiment and market volume relate over time, along with the underlying viral tweets for a selected date.

![Power BI sentiment vs volume page: a line chart of average sentiment against current volume from August to September, with a table of the day's viral tweets showing reply, retweet, like, sentiment, and interaction scores](/img/blogs/powerbi-sentiment-volume.png)

If you look closely at the tweet table, some emojis show up as question marks. That's the Unicode issue I mention in the next section, and it only became visible once the whole path from API to dashboard was connected.

Power BI Desktop connects to the SQL Pool in Import mode with SQL authentication. I didn't set up Power BI Service scheduled refresh, because that isn't available on a personal Microsoft account. So the evening pipeline ends with the warehouse refreshed and paused, and the dashboard picks up the new data on its next manual refresh.

The charts weren't the point. The dashboard was a test of whether the serving architecture made sense. If Power BI needs complicated transformations just to show a basic metric, the upstream model isn't doing enough work. By the end, Power BI was reading clean dimension and fact tables rather than rebuilding the pipeline inside the visualization layer.

# 10. What I'd Change for Production

This rebuild was scoped as a personal engineering project. Before treating it as a real financial data system, I'd change a few things:

- **Use an exchange calendar** instead of deriving trading days from the collected market data, so holidays and unexpected closures are explicit.
- **Move secrets into Azure Key Vault**, narrow the workspace RBAC roles, and pin the Python dependencies used by Spark.
- **Replace the retraining rule** with real model monitoring: evaluation windows, data-quality checks, and explicit model and feature versioning.
- **Add validation between layers** so malformed or incomplete data can't silently move from Bronze into downstream datasets.
- **Re-evaluate the Dedicated SQL Pool.** It was worth it here because I wanted to understand provisioning, dimensional modeling, stored procedures, and compute lifecycle. A small production workload might be better served by a serverless or lower-cost option.
- **Automate the last mile.** Publish the report to Power BI Service on a work or school account and schedule the refresh right after the SQL Pool refresh, so the pipeline ends with a refreshed dashboard rather than a refreshed warehouse.
- **Keep text Unicode-safe end to end.** Social media text is full of emojis, and they can get lost on the warehouse path before reaching the dashboard.

None of these mean the architecture failed. They're the things I can see now because I built enough of it to find where the boundaries are.

# 11. Key Takeaways

- **Bronze, Silver, and Gold are contracts.** Each layer is a stronger guarantee about what the data means and how safely it can be consumed, not just a cleaner file.
- **Preserve raw data before you transform it.** Reprocessing Bronze is cheaper and safer than asking an external API for the same data twice.
- **Time in a financial pipeline has business meaning.** A valid join can still leak the future. Respect what was knowable at prediction time.
- **The model is one artifact in a lifecycle.** Feature generation, inference, label availability, evaluation, and retraining are separate stages with separate dependencies.
- **ML data and BI data are different Gold tables.** Build both. Don't make the dashboard reverse-engineer the feature pipeline.
- **Cloud resources have state, lifecycle, and cost.** Resume, wait, check, run, pause. Design the pipeline to control cost rather than calculating it afterwards.
- **Automation exposes hidden assumptions.** Interactive package installs, unreleased compute, unpublished notebooks. None of these show up until nobody is clicking Run.

# Frequently Asked Questions

### Why use both Azure Data Factory and Azure Functions for ingestion?
Data Factory handled the historical backfill, where I needed parameterized requests over a date range and a Mapping Data Flow to flatten the JSON. The daily path only needs a small, scheduled fetch and light preprocessing, which is a better fit for a timer-triggered Function. Each tool owns the part it's simplest to maintain in.

### Is this pipeline real-time?
No. It's a scheduled micro-batch system. Data is collected once a day, the prediction runs at a fixed time, and the actual outcome is backfilled after market close. There's no continuously running consumer processing events one at a time.

### How do you avoid leaking future data when joining tweets to stock data?
Every tweet timestamp is converted to Eastern Time and compared against a 6:00 AM prediction cutoff. Tweets are mapped to the next available trading session, and only the market target for that session is joined. The pipeline only uses information that would have existed at prediction time.

### Why store the model in the data lake instead of a model registry?
For this project, persisting the Spark `PipelineModel` in ADLS was enough to make daily inference load the exact same feature transformations and model. A production system would add a registry with explicit versioning, but the lake made the model behave like any other pipeline artifact.

### Why pause the SQL Pool every day?
A Dedicated SQL Pool bills while it's running. The warehouse only needs to be online for the evening refresh, so the pipeline resumes it, waits for it to report Online, runs the refresh, and pauses it again. Compute exists only when the workflow needs it.

---

**Tech Stack:** `Azure Data Factory` · `Azure Data Lake Storage Gen2` · `Azure Synapse Analytics` · `Apache Spark` · `PySpark` · `Spark MLlib` · `Azure Functions` · `Synapse Dedicated SQL Pool` · `Power BI` · `Python` · `VADER` · `Yahoo Finance` · `RapidAPI`
