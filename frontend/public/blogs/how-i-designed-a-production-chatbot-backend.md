# 1. Why This Topic Matters

Most chatbot tutorials stop at `openai.chat.completions.create()`. You get a response, stream it to the frontend, and call it done. But that's where the real work starts. 

A production chatbot needs to handle different user intents, maintain conversation memory across sessions, log everything for debugging, and integrate with external tools like search APIs. When someone asks "show me laptops under $800," you can't just let the LLM guess—you need intent classification, product search, structured extraction, and proper error handling. 

The misconception is that prompt engineering solves everything. It doesn't. Prompts control how the LLM writes, but they can't fetch real-time data, enforce business logic, or prevent hallucinations when facts matter. In my AI engineering internship, after classifying intent, we'd call calculation or retrieval functions and explicitly tell the LLM to answer based on verified data—not make up numbers. This routing pattern is what separates demos from production systems.

Understanding the full stack helps you debug properly. Is the response slow because of a bad prompt? Or is vector search returning garbage? Or is the product API timing out? Without visibility into each layer, you're guessing. This matters for shopping assistants, customer support bots, financial analysis tools, or any LLM product where reliability counts. 


# 2. The Core Idea (Mental Model)

A production chatbot backend is a **multi-stage pipeline** with four main components:

1. **API layer** (FastAPI): Handles requests, manages streaming, exposes endpoints
2. **LLM orchestration** (LangGraph): Routes between agents based on intent and state
3. **Database** (MongoDB): Stores conversation history, embeddings, analytics
4. **External integrations** (SERP API, vector search): Fetches real-time data when needed

The mental model: **user query flows through a graph of specialized agents**, each handling a specific task. Memory agent retrieves context. Vision agent processes images. Intent agent classifies what the user wants. Writer agent generates the response. Product agent searches and extracts items. Shopping agent manages a 3-question recommendation flow.

Each agent gets a **shared state object** that passes through the graph. This state contains the user's query, conversation history, detected intent, retrieved memory, and any intermediate results. Agents read from it, modify it, and pass it to the next node.

The key insight: you don't need one giant prompt that does everything. You need **clear routing logic** and **specialized prompts** for each task. General questions get a conversational response. Product questions trigger search and extraction. Shopping mode enforces a 3-turn flow before recommending items.

# 3. How It Works in Practice

Here's the actual workflow from my LLM platform:

**Step 1: Memory Agent**
- Retrieves last 6 messages from MongoDB
- Runs vector search (OpenAI embeddings) to get top 4 similar past conversations
- Fetches the latest user summary (generated every 10 messages)
- Takes ~1 second

**Step 2: Vision Agent (if image uploaded)**
- Calls GPT-4o-mini to read the image
- Returns image description + user prompt as combined input
- Only triggered if attachments exist

**Step 3: Intent Agent**
- Classifies user intent: general, product_search, or shopping
- Takes <0.1 second
- Based on my testing, roughly 85% accurate (didn't formally measure)

**Step 4: Routing**
- General → Writer Agent
- Product search → Writer Agent → Product Agent
- Shopping mode → Shopping Agent (enforces 3-question flow)

**Step 5: Writer Agent**
- Generates response using the selected model (GPT-4o-mini, Claude Sonnet 4.5, Gemini 2.0 Flash, Perplexity, or Grok)
- Uses **custom system prompts** for each model provider
- Example: Grok gets "Be brutally honest, maximally helpful, and funny as hell" while product search gets structured, editorial-style prompts
- Takes 7-15 seconds depending on model

**Step 6: Product Agent (if product intent detected)**
- Extracts product queries from writer's response
- Calls Google SERP API for each product in parallel (async)
- Originally took 15 seconds, now ~10 seconds after parallelization
- Returns product cards with title, price, rating, URL

**Total latency:**
- General questions: ~6 seconds
- Product search: ~22 seconds (memory + writer + product extraction + SERP)

The API exposes `/stream` for real-time responses (reveals which agent is active, not chain-of-thought yet), `/history/{user_id}` to fetch past conversations, and four session endpoints (`/start`, `/end`, `/event`, `/{session_id}`) to log user interactions like scrolls, clicks, and hovers.

**LangGraph configuration** (simplified):
```
memory → vision (if image) → intent → writer → product (if needed) → end
                                  ↓
                              shopping (3-turn flow) → writer → end
```

Before LangGraph, I used if/else chains. It got messy fast—hard to track state, debug routing, or add new agents. LangGraph made the workflow explicit and gave me shared state management across nodes.

# 4. Tradeoffs and Design Decisions

**Why LangGraph instead of simpler orchestration?**
- **Pro**: Clear graph structure, shared state, conditional routing built-in
- **Pro**: Easy to debug in LangSmith (can see exact node execution and latency)
- **Con**: Learning curve and boilerplate setup
- **Con**: Overkill if you only have 2-3 simple steps

I switched because manual if/else became unmanageable when I needed to pass state between 6 agents and handle different routing paths.

**Why MongoDB instead of Postgres?**
- **Pro**: Flexible schema for unstructured LLM responses
- **Pro**: Native vector search (MongoDB Atlas) without a separate vector DB
- **Con**: No strong ACID guarantees if you need multi-document transactions
- **Con**: Harder to run complex analytics queries

I chose MongoDB because my data was hierarchical (sessions → events → queries) and I wanted vector search without managing Pinecone or Weaviate.

**Why store last 6 messages + top 4 embeddings + summary?**
- **Tradeoff**: Balance between context richness and token cost
- **Why not all messages?**: Context window limits and slower retrieval
- **Why embeddings?**: Captures semantically similar conversations even if not recent
- **Why summary?**: Compresses long-term user preferences without blowing up tokens

Honestly, I didn't rigorously A/B test these numbers. 6 messages felt like enough recent context, and 4 embeddings kept the retrieval fast (<1 second).

**Why async product search?**
- **Before**: Sequential SERP calls took 15 seconds
- **After**: Parallel async requests cut it to 10 seconds
- **Tradeoff**: More complex error handling (what if one product fails?)

This was the single biggest latency improvement.

**Why custom system prompts per model?**
Each model has a personality. I observed ChatGPT's editorial style for product search and asked Grok to describe itself. The result: Grok responses sound like "Twitter after too many espressos," while product search prompts are structured with emoji headers and buying guidance. This mimicry makes the platform feel native to each model.

# 5. Failure Cases and Common Mistakes

**Intent classification gets it wrong**
Sometimes the intent agent routes "what's a good laptop?" to general instead of product_search. No quick fix—better prompting or fine-tuning could help, but I haven't implemented either yet.

**Vector search returns irrelevant context**
If embeddings are too generic or the query is ambiguous, the top 4 results might be useless. This pollutes the LLM's context and wastes tokens. I didn't build a relevance filter yet.

**Product extraction hallucinates queries**
The writer agent sometimes generates product search terms that don't match what the user asked. For example, user asks "best budget phones" and it extracts "flagship Samsung phones." This happens when the prompt isn't explicit enough about staying grounded.

**22-second latency is too slow**
For a shopping assistant, 22 seconds feels broken. Users expect <3 seconds. I need caching (Redis for repeated queries), faster models for simple intents, or speculative product search (start fetching before writer finishes).

**No rate limiting**
Right now, nothing stops a user from spamming requests and draining API credits. I need per-user rate limits and token budgets.

**Chain-of-thought streaming doesn't work yet**
I stream which agent is active (memory → intent → writer), but I can't stream the LLM's internal reasoning steps. This would help users understand why the bot is taking so long.

**Session logging creates huge documents**
Storing every scroll and click event in MongoDB causes session documents to bloat. I should batch writes or move low-priority events to a separate analytics pipeline.

# 6. What I Learned Personally

I thought prompt engineering was 80% of the work. It's maybe 30%. The rest is orchestration, data modeling, and operational debugging.

Before LangGraph, I underestimated how hard state management gets when you have multiple agents. Passing variables through if/else chains broke constantly. LangGraph's explicit graph made bugs obvious.

I didn't realize vector search would be this fast. MongoDB Atlas vector search returns top-K results in under 1 second even with thousands of documents. I expected to need Pinecone.

The 22-second latency taught me that **parallelization matters more than model choice**. Switching from GPT-4 to GPT-4o-mini saved 2 seconds. Parallelizing product search saved 5 seconds. The architecture change had bigger impact than the model swap.

Custom system prompts per model provider was surprisingly effective. Grok with its "brutally honest" prompt actually feels different from Claude's measured tone. Users notice.

# 7. Key Takeaways

- **LangGraph is worth it** when you have 4+ agents with conditional routing. Below that, simple if/else is fine.
- **Async parallelization** is the easiest latency win. If you're waiting on multiple external APIs, call them simultaneously.
- **Vector search + recent messages + summary** is a solid memory pattern. Adjust the numbers based on your token budget and context window.
- **Intent classification accuracy matters more than model intelligence**. A fast, 85% accurate router beats a slow, 95% accurate one if it keeps users engaged.
- **MongoDB works well for LLM systems** if your data is unstructured and you need vector search without extra infrastructure.
- **Observability is critical**. Log everything—agent paths, latencies, token usage, user events. You'll need it when debugging production issues.

# Frequently Asked Questions

### What's the difference between a chatbot demo and a production backend?
A demo calls an LLM API and streams the response. A production backend adds intent routing, conversation memory, external tool integration (search APIs, databases), analytics logging, and error handling. The difference is in handling edge cases, maintaining context across sessions, and debugging when things break.

### Why use LangGraph instead of LangChain or simple if/else?
LangGraph makes multi-agent workflows explicit with a graph structure and shared state management. If you only have 2-3 linear steps, if/else is simpler. But when you need conditional routing (e.g., general chat vs product search vs shopping mode) and 4+ agents, LangGraph prevents the spaghetti code that if/else chains create.

### How do you prevent LLM hallucinations in a chatbot?
Use external tools for facts. Instead of letting the LLM guess product prices or calculations, classify the user's intent, call a search API or database, and tell the LLM to answer based on retrieved data. This is the core idea behind function calling and tools like Model Context Protocol (MCP).

### What's the best way to store conversation history for LLMs?
Store recent messages (last 6-10), use vector search for semantically similar past conversations (top 3-5 embeddings), and generate periodic summaries (every 10-20 messages). This balances context richness with token cost and retrieval speed.

### How long should a production chatbot response take?
For consumer products, aim for under 3 seconds. My system took 22 seconds because of sequential product searches—parallelizing cut it to 10 seconds. If your workflow involves multiple API calls, async parallelization is the biggest latency win.

### Do I need a separate vector database like Pinecone?
Not necessarily. MongoDB Atlas has built-in vector search that works well for moderate scale (thousands to millions of documents). If you need sub-100ms vector search at billion-document scale, then consider dedicated vector DBs like Pinecone or Weaviate.