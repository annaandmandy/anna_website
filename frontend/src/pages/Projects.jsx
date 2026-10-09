import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import ProjectModal from "../components/ProjectModal";
import SEO from "../components/SEO";

export default function Projects() {
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();

    const slugify = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const hasLink = (project) => Boolean(project.link) && project.link !== "#";

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    useEffect(() => {
        if (!location.hash) return;
        const el = document.getElementById(location.hash.slice(1));
        if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
    }, [location.hash]);

    const projects = [
        {
            title: "Meridian \u2014 Confidential M&A Agent",
            category: "AI Engineering",
            desc: "\ud83c\udfc6 2nd Place (Dell \u00d7 NVIDIA Hackathon) \u2014 a neutral M&A due-diligence agent that runs entirely on one air-gapped box, so neither party's private data ever leaves the hardware.",
            detailedDesc: "Two companies want to do a deal, but neither will hand its private data to the other. Meridian is the neutral middle ground: both sides upload signed disclosures into a local clean room, ask questions through Slack, and meet over WebRTC \u2014 and no data, model call or transcript leaves the machine. Access is decided by a deterministic policy engine rather than the model, and every answer carries an evidence label. Built with Carrie Feng in an 8-hour hackathon; I owned the integration and local-serving side \u2014 packaging the agent as an OpenClaw skill on NemoClaw, serving Qwen3.6 locally through vLLM on the GB10, sandboxing it in OpenShell with a host policy that exposes only a few declared API paths, and building the Slack command surface, identity-scoped deal-room access and the clean-room, report and meeting-room interfaces. Carrie owned the defence logic and the vision and voice pipelines.",
            tech: ["OpenClaw", "NemoClaw", "OpenShell", "vLLM", "Qwen3.6", "NVIDIA GB10", "Slack API", "WebRTC", "Whisper", "Flask", "Docker"],
            metrics: ["\ud83c\udfc6 2nd Place", "Fully on-prem", "Qwen3.6 on vLLM", "Zero egress"],
            impact: "Showed that a confidential, two-party AI workflow can run with no cloud dependency at all \u2014 local inference on a single Dell Pro Max with NVIDIA GB10, access decided in code rather than by the model.",
            link: "/blogs/meridian-a-neutral-m-and-a-agent-that-never-leaves-the-box",
            github: "https://github.com/annaandmandy/dell_nvidia_hackathon"
        },
        {
            title: "Citale",
            category: "Full Stack",
            desc: "Social media platform for event discovery, developed within BU Spark! Launch Lab incubator.",
            detailedDesc: "Developer for a social media platform launched for beta testing. Designed a normalized PostgreSQL schema with strict foreign key constraints. Integrated Google Maps API for geospatial discovery and PostHog for user behavior analytics.",
            tech: ["Next.js", "Supabase", "PostgreSQL", "Google Maps API", "Vercel"],
            metrics: ["Beta Launched", "10+ Core Features", "PostHog Analytics"],
            impact: "Successfully moved from architectural design to a public beta launch, targeting the Boston student community.",
            link: "https://citale.vercel.app",
            github: "https://github.com/sbel2/Citale",
            blog: "/blogs/building-citale-messaging-profiles-and-images-on-supabase"
        },
        {
            title: "LLM Multi-Agent Platform",
            category: "AI Engineering",
            desc: "Architected a multi-agent RAG system using LangGraph and FastAPI to orchestrate complex retrieval and observability workflows.",
            detailedDesc: "Built a production-grade multi-agent platform for product enrichment that orchestrates complex RAG workflows. Engineered a high-performance observability backend using FastAPI to log and analyze 1536-dimensional embeddings, enabling real-time monitoring of agent performance.",
            tech: ["FastAPI", "LangGraph", "MongoDB", "RAG", "Vector Databases", "Python", "GEO"],
            metrics: ["In Production", "Multi-Agent Orchestration"],
            impact: "Built a production-grade multi-agent platform for Generative search optimization(GEO) research focusing on Brands.",
            link: "https://llm-platform.vercel.app",
            github: "https://github.com/annaandmandy/LLMPlatform",
            blog: "/blogs/how-i-designed-a-production-chatbot-backend"
        }, {
            title: "Relational Database Engine Kernel",
            category: "Systems Engineering",
            desc: "High-performance C++20 database kernel featuring an LRU buffer pool and B+ Tree indexing.",
            detailedDesc: "Developed a storage engine core in C++20. Implemented a Buffer Pool Manager with O(1) LRU eviction and a B+ Tree index supporting cascading splits. Engineered a bitmap-based Heap File system achieving 96% space utilization for fixed-width records.",
            tech: ["C++20", "Memory Management", "B+ Tree", "LRU Cache", "GDB"],
            metrics: ["O(log n) Search", "96% Space Efficiency", "C++20"],
            impact: "Hand built a storage engine core in C++20. Implemented a Buffer Pool Manager with O(1) LRU eviction and a B+ Tree index supporting cascading splits. Engineered a bitmap-based Heap File system achieving 96% space utilization for fixed-width records.",
            link: "#",
            github: "https://github.com/annaandmandy/CS660-Fall2024-pa"
        },
        {
            title: "Distributed Real-time Game Infrastructure",
            category: "Backend Engineering",
            desc: "Scalable event-driven backend using Kafka and WebSockets for real-time state synchronization.",
            detailedDesc: "Orchestrated a distributed backend using Nginx as a reverse proxy to manage WebSocket traffic. Implemented an event-sourcing architecture with Apache Kafka to log state transitions and Redis for high-speed session management. Deployed via Docker on DigitalOcean.",
            tech: ["Apache Kafka", "Redis", "WebSocket", "Nginx", "Docker", "Node.js"],
            metrics: ["Event-driven", "Horizontal Scaling", "Dockerized"],
            impact: "Still in development. Handle state synchronization for a real-time game.",
            link: "https://www.hsiangyuhuang.com/onsen-game",
            github: "https://github.com/annaandmandy/anna_website/tree/main/onsen-backend"
        },
        {
            title: "Multi-Agent AI Novel Generator",
            category: "AI Engineering",
            desc: "Director, Planner, Writer, Editor pipeline in LangGraph that generates coherent long-form web novels, with a code-driven state machine controlling pacing and an Editor loop for self-correction.",
            detailedDesc: "Designed and deployed a multi-agent novel generator for long power-fantasy and infinite-flow web novels. A deterministic Director state machine controls plot phase and pacing, a Planner LLM turns it into story beats, a Writer LLM produces chapters plus structured memory and character deltas, and an Editor LLM rejects drafts that break continuity. Story state lives in Supabase; the reader prefetches chapters ahead of the user.",
            tech: ["LangGraph", "Gemini", "DeepSeek", "Express", "Supabase", "React", "Cloudflare Workers", "Railway"],
            metrics: ["4-stage pipeline", "Editor rewrite loop", "100+ chapters"],
            impact: "Generates long-form narratives that hold plot structure and character continuity across 100+ chapters",
            link: "https://dogblood-novel.dogblood-novel.workers.dev/",
            github: "https://github.com/annaandmandy/dogblood-novel",
            blog: "/blogs/building-a-multi-agent-novel-generator-keeping-an-llm-on-plot"
        }, {
            title: "NVIDIA Sentiment Data & ML Pipeline",
            category: "Data Engineering",
            desc: "Rebuilt an end-to-end Azure pipeline that turns daily tweets and stock data into stock-volume predictions, from historical backfill to scheduled inference and retraining.",
            detailedDesc: "Engineered a Medallion-architecture pipeline on ADLS Gen2 orchestrated by Azure Data Factory. Ingests 500+ daily tweets and stock data via Azure Functions, transforms them with Synapse Spark, trains and serves a stock-volume prediction model with MLlib, and lands results in a dedicated SQL warehouse for Power BI dashboards.",
            tech: ["Azure Data Factory", "Synapse Spark", "ADLS Gen2", "Azure Functions", "Spark MLlib", "Dedicated SQL Pool", "Medallion Architecture", "Python", "Power BI", "RapidAPI"],
            metrics: ["500 Tweets/Day", "Scheduled Inference", "Automated Retraining", "Medallion Architecture"],
            impact: "Automated the full path from raw social discourse to a retrained, scheduled stock-volume prediction model with daily Power BI trend visualizations and sentiment tracking.",
            link: "https://drive.google.com/file/d/1NYY6TYn6GqhrX9HX0D0ZWnrpZfo0DMal/view?usp=drive_link",
            github: null,
            blog: "/blogs/from-tweets-to-trends-building-an-end-to-end-azure-data-and-ml-pipeline"
        },
        {
            title: "Boston Weekend Agent",
            category: "Cloud & Backend",
            desc: "Serverless weekend guide that collects Greater Boston events daily, ranks them with an LLM editor, and publishes to its own Threads account on schedule \u2014 unattended.",
            detailedDesc: "EventBridge Scheduler triggers a Step Functions state machine over four containerized Lambdas \u2014 event collection, LLM report, bilingual social copy and activity feedback \u2014 writing timestamped snapshots to S3 and votes to DynamoDB. Events come from Ticketmaster, the City of Boston RSS feed and municipal iCalendar feeds, normalized so one unavailable source never discards usable events from the others. The LLM editor has a versioned persona and reviewed long-term memory in S3, while deterministic code keeps the hard facts \u2014 dates, cancellations, sold-out status, links \u2014 that the model is not allowed to rewrite. Cost is bounded by a conservative 50,000-token estimate gate before each ranking call and a 7,000-token output cap. Infrastructure ships with the code: least-privilege IAM templates, the Step Functions definition, and timezone-aware CloudFormation.",
            tech: ["AWS Lambda (containers)", "Step Functions", "EventBridge Scheduler", "S3", "DynamoDB", "API Gateway", "CloudFront", "CloudFormation", "IAM", "Docker buildx", "OpenAI", "Python"],
            metrics: ["Runs unattended", "4-Lambda state machine", "Token-capped LLM calls", "Infra as code"],
            impact: "Has been publishing on schedule without intervention, with 3.6K+ views on the bot's own Threads account. Replaced an earlier always-on EC2 scraper, so there is no idle compute between runs.",
            link: "https://www.threads.net/@bostonweekendagent",
            github: "https://github.com/annaandmandy/boston-weekend-agent"
        },
        {
            title: "RhettSearch – Gamified Research Engine",
            category: "Full Stack",
            desc: "🏆 Best Overall (DS+X Hackathon) - Gamified research engine using semantic search and AI recommendations.",
            detailedDesc: "Won Best Overall at DS+X Hackathon for building a gamified academic research platform. Integrated OpenAI API for intelligent paper summaries and OpenAlex for citation data. Created engaging UX that makes literature review more interactive and fun.",
            tech: ["React", "OpenAI API", "OpenAlex", "Semantic Search"],
            metrics: ["🏆 Best Overall", "Hackathon win", "AI summaries", "Citation data"],
            impact: "Won Best Overall award for making academic research engaging through gamification and AI assistance",
            link: "https://devpost.com/software/rhettsearch",
            github: null
        },
        {
            title: "U.S. Virtual Garden",
            category: "Data Visualization",
            desc: "🏆 Dashboard Prize (CivilHack) - Interactive dashboard visualizing U.S. Herbaria data with Groq API.",
            detailedDesc: "Won Dashboard Prize at CivilHack for creating an interactive visualization of U.S. Herbaria data. Used Groq API to generate dynamic plant descriptions and Looker Studio for high-impact data visualizations accessible to general audiences.",
            tech: ["Looker Studio", "Groq API", "Data Visualization", "Python"],
            metrics: ["🏆 Dashboard Prize", "Herbaria data", "AI descriptions", "Public dashboard"],
            impact: "Won Dashboard Prize for making botanical data accessible through compelling visualizations and AI-generated insights",
            link: "https://devpost.com/software/virtual-garden-lfmqhy",
            github: null
        },
        {
            title: "Hybrid ARIMA–XGBoost Demand Forecasting",
            category: "Machine Learning",
            desc: "Developed a hybrid ARIMA–XGBoost forecasting pipeline for a GPU component manufacturer, improving accuracy from 8.3% → 73.4%.",
            detailedDesc: "Research project at NTUST AI & Decision Analysis Lab. Decomposed nine years of monthly sales, modelled the stable seasonal component with seasonal ARIMA and the variable component with XGBoost, then recombined them \u2014 lifting R\u00b2 from 0.083 to 0.734 and cutting MAPE from 28.8% to 16.7% against a single-ARIMA baseline. A conditional rolling window that retrains when forecast error passes a threshold brought MAPE to 14.2%. Engineered external demand drivers as features, including cryptocurrency price, an upstream chip maker's share price and product launch events. Built as decision support for procurement and inventory planning, and presented to the client's business team lead.",
            tech: ["ARIMA", "XGBoost", "Time Series", "Python", "Scikit-learn"],
            metrics: ["R\u00b2 0.083 \u2192 0.734", "MAPE 28.8% \u2192 14.2%", "Hybrid model", "NTUST Research"],
            impact: "Turned a baseline that barely tracked the series (R\u00b2 0.083) into a usable monthly forecast (R\u00b2 0.734) by splitting the signal in two and modelling each part with the method that suited it.",
            link: "#",
            github: null
        },
        {
            title: "Smart Vending Machine Shelf Optimization",
            category: "Machine Learning",
            desc: "Clustered vending machine products and built a classification tree to identify shelf arrangements linked to high sales performance.",
            detailedDesc: "Research project at NTUST Stats Lab: Applied K-means clustering on vending machine sales data to group products by behavior patterns. Built decision tree classifier to identify optimal shelf placements that correlate with high sales performance, providing actionable retail recommendations.",
            tech: ["K-Means", "Decision Trees", "Python", "Retail Analytics"],
            metrics: ["K-means clustering", "Sales optimization", "Research project", "NTUST"],
            impact: "Identified shelf arrangements that increased product sales by optimizing placement based on purchasing behavior patterns",
            link: "#",
            github: null
        },
        {
            title: "X-Decoder Optimization",
            category: "Deep Learning",
            desc: "Optimizing deep learning models for low-power computer vision.",
            detailedDesc: "Worked on optimizing X-Decoder, a state-of-the-art vision model, for deployment on low-power edge devices. Applied model compression techniques including quantization and pruning to reduce model size while maintaining accuracy for real-time computer vision tasks.",
            tech: ["PyTorch", "Model Compression", "Computer Vision", "Deep Learning"],
            metrics: ["Model optimization", "Edge deployment", "Compression", "Computer vision"],
            impact: "Reduced model size for efficient edge deployment while maintaining computer vision accuracy",
            link: "https://drive.google.com/file/d/1_N1JwI06ss6ebdgRwiY0lMvBKJr1KBB9/view?usp=drive_link",
            github: null
        },
        {
            title: "Equity in Federal Budget Earmarking",
            category: "Data Analysis",
            desc: "Analyzed federal earmark funding data from Senator Markey's public records to evaluate equity across Massachusetts communities.",
            detailedDesc: "Policy data analysis project: Extracted and analyzed federal earmark funding data from Senator Markey's Senate PDF reports using Python. Created per-capita funding visualizations revealing disparities in resource allocation across Massachusetts regions, informing equity discussions.",
            tech: ["Python", "Pandas", "Data Extraction", "Policy Analysis"],
            metrics: ["PDF extraction", "Equity analysis", "Senate data", "MA communities"],
            impact: "Revealed per-capita funding disparities across Massachusetts communities through systematic public records analysis",
            link: "https://drive.google.com/file/d/13AhXXN1NIwEa0Vb_eENFJmJzaaAD_k7x/view?usp=drive_link",
            github: null
        },
        {
            title: "Ancillary Power Market Forecasting",
            category: "Machine Learning",
            desc: "Undergraduate capstone forecasting hourly frequency-regulation reserve trading volume on Taipower's ancillary services market, with a SARIMAX\u2013neural-net hybrid.",
            detailedDesc: "NTUST Industrial Management capstone (3-person team). Forecast hourly frequency-regulation reserve trading volume on Taiwan's ancillary services market from 6,312 hourly records plus weather and calendar features, after filling missing weather values from nearby stations and dropping dates with too much missing data. SARIMAX captured the 24-hour seasonality with exogenous variables; feeding its residuals into a back-propagation network lifted three-class volume-tier accuracy from 64.07% to 70.03%. Delivered management recommendations: demand-based bid price caps, time-of-day bidding for smaller suppliers, and an aggregator model pooling small suppliers.",
            tech: ["SARIMAX", "Back-Propagation Network", "Time Series", "Python", "statsmodels"],
            metrics: ["64.07% \u2192 70.03%", "6,312 hourly records", "Hybrid residual model", "NTUST Capstone"],
            impact: "Showed that routing SARIMAX residuals through a neural network beats either model alone on volume-tier classification, and turned the forecast into concrete bidding-strategy recommendations for smaller suppliers.",
            link: "https://drive.google.com/file/d/1ymSMYf7Qc58ASLcXHSMZMMnxLYQvSIaI/view?usp=drive_link",
            github: null
        },
        {
            title: "Quantitative Investment Strategy Analysis",
            category: "Data Analysis",
            desc: "Designed and backtested four trading strategies using MA, RSI, BIAS, and Bollinger Bands.",
            detailedDesc: "Quantitative finance project: Designed and backtested four algorithmic trading strategies using Moving Averages, Relative Strength Index, BIAS indicators, and Bollinger Bands. Performed comprehensive performance analysis including risk-adjusted returns and drawdown metrics.",
            tech: ["Quantitative Finance", "Python", "Backtesting", "Technical Indicators"],
            metrics: ["4 strategies", "Backtesting", "Risk analysis", "Quant finance"],
            impact: "Evaluated trading strategy performance through systematic backtesting and risk-adjusted return analysis",
            link: "https://drive.google.com/file/d/11NdOXpROD5kXkBDKqRT0YKWfbgX6q7mm/view?usp=sharing",
            github: null
        },
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": projects.map((project, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "SoftwareApplication",
                "name": project.title,
                "description": project.detailedDesc || project.desc,
                "applicationCategory": project.category || "Software",
                "operatingSystem": "Web, Cloud",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                },
                "author": {
                    "@type": "Person",
                    "name": "Hsiang Yu (Anna) Huang"
                },
                "url": !hasLink(project)
                    ? `https://www.hsiangyuhuang.com/projects#${slugify(project.title)}`
                    : project.link.startsWith('http') ? project.link : `https://www.hsiangyuhuang.com${project.link}`
            }
        }))
    };

    return (
        <div className="container section">
            <SEO
                title="Projects - Hsiang Yu (Anna) Huang"
                description="Explore my portfolio of AI, Backend, and Full Stack projects. Featuring Multi-Agent Systems, RAG Pipelines, and Cloud Infrastructure implementations."
                name="Hsiang Yu Huang"
                type="website"
                jsonLd={jsonLd}
            />
            <div className="text-center" style={{ marginBottom: "var(--spacing-xl)", marginTop: "var(--spacing-xl)" }} data-aos="fade-down">
                <h1>All Projects</h1>
                <p>A collection of my work in AI Engineering, Backend Development, and Full Stack applications.</p>
            </div>

            <div className="grid grid-3">
                {projects.map((project, index) => (
                    <div key={index} id={slugify(project.title)} className="grid-item project-card" data-aos="fade-up">
                        {project.category && (
                            <div className="project-category">{project.category}</div>
                        )}
                        <h3 style={{ marginBottom: "0.5rem" }}>{project.title}</h3>

                        {/* Metrics Badges */}
                        {project.metrics && (
                            <div className="flex" style={{ gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
                                {project.metrics.map((metric, i) => (
                                    <span key={i} className="metric-badge">{metric}</span>
                                ))}
                            </div>
                        )}

                        {/* Tech Stack */}
                        <div className="flex" style={{ gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                            {project.tech.map(t => (
                                <span key={t} className="tech-badge">{t}</span>
                            ))}
                        </div>

                        <p style={{ marginBottom: "1rem", fontSize: "0.95rem" }}>{project.desc}</p>

                        {/* Impact Statement */}
                        {project.impact && (
                            <p style={{ fontSize: "0.85rem", fontStyle: "italic", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                                💡 {project.impact}
                            </p>
                        )}

                        {project.blog && (
                            <p style={{ fontSize: "0.85rem", marginBottom: "0.75rem" }}>
                                <Link to={project.blog} style={{ fontWeight: 600 }}>
                                    📝 Read the blog post →
                                </Link>
                            </p>
                        )}

                        <div className="flex" style={{ gap: "0.5rem", flexWrap: "wrap" }}>
                            {hasLink(project) && (
                                project.link.startsWith('/') ? (
                                    <Link to={project.link} className="btn btn-outline btn-sm">
                                        {project.link.startsWith('/blogs/') ? 'Read Blog Post' : 'View'}
                                    </Link>
                                ) : (
                                    <a href={project.link} className="btn btn-outline btn-sm" target="_blank" rel="noopener noreferrer">
                                        Live Demo
                                    </a>
                                )
                            )}
                            {project.detailedDesc && (
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => {
                                        setSelectedProject(project);
                                        setIsModalOpen(true);
                                    }}
                                >
                                    Learn More
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Project Modal */}
            <ProjectModal
                project={selectedProject}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}