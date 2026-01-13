import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ProjectModal from "../components/ProjectModal";
import SEO from "../components/SEO";

export default function Projects() {
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    const projects = [
        {
            title: "Citale",
            category: "Full Stack",
            desc: "Social media platform for event discovery, developed within BU Spark! Launch Lab incubator.",
            detailedDesc: "Developer for a social media platform launched for beta testing. Designed a normalized PostgreSQL schema with strict foreign key constraints. Integrated Google Maps API for geospatial discovery and PostHog for user behavior analytics.",
            tech: ["Next.js", "Supabase", "PostgreSQL", "Google Maps API", "Vercel"],
            metrics: ["Beta Launched", "10+ Core Features", "PostHog Analytics"],
            impact: "Successfully moved from architectural design to a public beta launch, targeting the Boston student community.",
            link: "https://www.citaleco.com",
            github: null
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
            github: "https://github.com/annaandmandy/LLMPlatform"
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
            desc: "Hierarchical agent workflow (Director, Planner, Writer) capable of generating coherent long-form narratives with recursive self-correction.",
            detailedDesc: "Designed and deployed a hierarchical multi-agent system on Cloudflare Workers that generates 10,000+ word coherent narratives. Implemented recursive self-correction loops and solved context window challenges to maintain plot continuity across chapters. Leverages Supabase for story state management.",
            tech: ["LangGraph", "Cloudflare Workers", "Supabase", "OpenAI API"],
            metrics: ["3-tier hierarchy", "Serverless", "Auto-correction"],
            impact: "Generates publication-quality long-form content with maintained narrative consistency across 15+ chapters",
            link: "https://dogblood-novel.dogblood-novel.workers.dev/",
            github: "https://github.com/annaandmandy/dogblood-novel"
        }, {
            title: "NVIDIA Sentiment Data Pipeline",
            category: "Data Engineering",
            desc: "Built an automated Medallion architecture pipeline using Azure Synapse and Function Apps for stock sentiment analysis.",
            detailedDesc: "Engineered an end-to-end data pipeline to ingest and process 500+ daily tweets and stock data. Developed Azure Function Apps to automate daily ETL tasks and ingest data into a Gold-layer for further analysis.",
            tech: ["Azure Synapse", "Azure Function Apps", "Medallion Architecture", "PostgreSQL", "Python", "Power BI", "Azure Blob Storage", "RapidAPI"],
            metrics: ["500 Tweets/Day", "Daily Automation", "Medallion Architecture"],
            impact: "Successfully automated the transition of raw social discourse into structured financial datasets, enabling daily Power BI trend visualizations and sentiment tracking.",
            link: "https://drive.google.com/file/d/1NYY6TYn6GqhrX9HX0D0ZWnrpZfo0DMal/view?usp=drive_link",
            github: null
        },
        {
            title: "Boston Weekend Vibe",
            category: "Cloud & Backend",
            desc: "Automated event and weather reporting system using AWS serverless architecture.",
            detailedDesc: "Built a serverless application using AWS Lambda, S3, and EC2 that generates daily personalized weekend reports combining weather data and Boston events. Automated data collection from multiple APIs and deployed with scheduled triggers. Handles web scraping for event data with EC2 instances.",
            tech: ["AWS Lambda", "AWS S3", "AWS EC2", "Python", "APIs"],
            metrics: ["Serverless", "Daily automation", "Multi-source data", "AWS", "Web Scraping"],
            impact: "Fully automated weekend planning reports with 100% uptime using AWS serverless architecture",
            link: "/weekend_report",
            github: null
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
            detailedDesc: "Research project at NTUST AI Lab: Designed a hybrid forecasting model combining ARIMA time-series analysis with XGBoost machine learning. Implemented rolling window adaptive modeling that achieved a 65.1% R² improvement in sales prediction accuracy for GPU components.",
            tech: ["ARIMA", "XGBoost", "Time Series", "Python", "Scikit-learn"],
            metrics: ["65.1% R² gain", "Hybrid model", "Production deployment", "Research"],
            impact: "Achieved 65.1% R² improvement (from 8.3% to 73.4%) in demand forecasting accuracy through innovative hybrid modeling",
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
            title: "Power System Load Forecasting",
            category: "Machine Learning",
            desc: "Forecasted Taiwan's electricity demand using SARIMAX and Neural Networks, achieving 69.4% accuracy.",
            detailedDesc: "Time series forecasting project predicting Taiwan's electricity load using SARIMAX (Seasonal ARIMA with exogenous variables) and neural network models. Incorporated weather data and calendar features to achieve 69.4% prediction accuracy for power grid planning.",
            tech: ["SARIMAX", "Neural Networks", "Time Series", "Python"],
            metrics: ["69.4% accuracy", "Power grid", "Time series", "Taiwan"],
            impact: "Achieved 69.4% accuracy in electricity demand forecasting to support power grid capacity planning",
            link: "https://drive.google.com/file/d/1ymSMYf7Qc58ASLcXHSMZMMnxLYQvSIaI/view?usp=drive_link",
            github: null
        },
        {
            title: "Sundai Club Projects",
            category: "Hackathon",
            desc: "Participated in multiple Sundai Club hackathons building creative LLM-powered applications.",
            detailedDesc: "Active participant in Sundai Club hackathons, experimenting with cutting-edge LLM applications and web technologies. Built several prototypes exploring creative uses of AI in storytelling, productivity tools, and interactive experiences.",
            tech: ["Web Development", "LLM", "React", "APIs"],
            metrics: ["Multiple hacks", "LLM apps", "Rapid prototyping", "Community"],
            impact: "Built multiple LLM-powered prototypes through hackathon rapid development cycles",
            link: "https://www.sundai.club/hacker/9563db75-7468-4092-98e8-70d9112a127d",
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

    return (
        <div className="container section">
            <SEO
                title="Projects - Hsiang Yu (Anna) Huang"
                description="Explore my portfolio of AI, Backend, and Full Stack projects. Featuring Multi-Agent Systems, RAG Pipelines, and Cloud Infrastructure implementations."
                name="Hsiang Yu Huang"
                type="website"
            />
            <div className="text-center" style={{ marginBottom: "3rem", marginTop: "3rem" }} data-aos="fade-down">
                <h1>All Projects</h1>
                <p>A collection of my work in AI Engineering, Backend Development, and Full Stack applications.</p>
            </div>

            <div className="grid grid-3">
                {projects.map((project, index) => (
                    <div key={index} className="grid-item project-card" data-aos="fade-up">
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

                        <div className="flex" style={{ gap: "0.5rem" }}>
                            <a href={project.link} className="btn btn-outline btn-sm" target="_blank" rel="noopener noreferrer">
                                {project.link.startsWith('/') ? 'View' : 'Live Demo'}
                            </a>
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