import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Projects() {
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    const projects = [
        {
            title: "LLM Multi-Agent Platform",
            desc: "Architected a multi-agent RAG system using LangGraph and FastAPI to orchestrate complex retrieval and observability workflows.",
            tech: ["FastAPI", "LangGraph", "MongoDB", "RAG"],
            link: "https://llm-platform.vercel.app"
        }, {
            title: "Multi-Agent AI Novel Generator",
            desc: "Hierarchical agent workflow (Director, Planner, Writer) capable of generating coherent long-form narratives with recursive self-correction.",
            tech: ["LangGraph", "Cloudflare Workers", "Supabase"],
            link: "https://dogblood-novel.dogblood-novel.workers.dev/"
        }, {
            title: "NVIDIA Stock Forecast",
            desc: "Real-time data pipeline for forecasting stock volume from tweets.",
            tech: ["Azure Synapse", "Medallion Architecture"],
            link: "https://drive.google.com/file/d/1NYY6TYn6GqhrX9HX0D0ZWnrpZfo0DMal/view?usp=drive_link"
        },
        {
            title: "X-Decoder Optimization",
            desc: "Optimizing deep learning models for low-power computer vision.",
            tech: ["Deep Learning", "Model Compression"],
            link: "https://drive.google.com/file/d/1_N1JwI06ss6ebdgRwiY0lMvBKJr1KBB9/view?usp=drive_link"
        },
        {
            title: "Equity in Federal Budget Earmarking",
            desc: "Analyzed federal earmark funding data from Senator Markey’s public records to evaluate equity across Massachusetts communities.",
            tech: ["Python", "Policy Data Analysis"],
            link: "https://drive.google.com/file/d/13AhXXN1NIwEa0Vb_eENFJmJzaaAD_k7x/view?usp=drive_link"
        },
        {
            title: "Hybrid ARIMA–XGBoost Demand Forecasting",
            desc: "Developed a hybrid ARIMA–XGBoost forecasting pipeline for a GPU component manufacturer, improving accuracy from 8.3% → 73.4%.",
            tech: ["ARIMA", "XGBoost", "Time Series"],
            link: "#"
        },
        {
            title: "Smart Vending Machine Shelf Optimization",
            desc: "Clustered vending machine products and built a classification tree to identify shelf arrangements linked to high sales performance.",
            tech: ["K-Means", "Decision Trees", "Python"],
            link: "#"
        },
        {
            title: "Power System Load Forecasting",
            desc: "Forecasted Taiwan’s electricity demand using SARIMAX and Neural Networks, achieving 69.4% accuracy.",
            tech: ["SARIMAX", "Neural Networks"],
            link: "https://drive.google.com/file/d/1ymSMYf7Qc58ASLcXHSMZMMnxLYQvSIaI/view?usp=drive_link"
        },
        {
            title: "Sundai Club Projects",
            desc: "Joining the Hack at Sundai Club for several times.",
            tech: ["Web Development", "LLM", "Interesting Projects"],
            link: "https://www.sundai.club/hacker/9563db75-7468-4092-98e8-70d9112a127d"
        },
        {
            title: "Boston Weekend Vibe",
            desc: "Generate a event and weather report for you everyday.",
            tech: ["AWS Lambda", "AWS S3", "AWS EC2", "APIs"],
            link: "/weekend_report"
        },
        {
            title: "RhettSearch",
            desc: "Gamified research engine using semantic search and AI recommendations.",
            tech: ["React", "OpenAI", "OpenAlex"],
            link: "https://devpost.com/software/rhettsearch"
        },
        {
            title: "U.S. Virtual Garden",
            desc: "Interactive dashboard visualizing U.S. Herbaria data with Groq API.",
            tech: ["Looker Studio", "Groq API"],
            link: "https://devpost.com/software/virtual-garden-lfmqhy"
        },
        {
            title: "Citale",
            desc: "Social media platform for finding things to do in Boston.",
            tech: ["React", "Google Maps API", "SQL"],
            link: "https://www.citaleco.com"
        },
        {
            title: "Quantitative Investment Strategy Analysis",
            desc: "Designed and backtested four trading strategies using MA, RSI, BIAS, and Bollinger Bands.",
            tech: ["Quantitative Trading Strategies", "Performance Analysis", "Market Trend Analysis"],
            link: "https://drive.google.com/file/d/11NdOXpROD5kXkBDKqRT0YKWfbgX6q7mm/view?usp=sharing"
        },
    ];

    return (
        <div className="container section">
            <div className="text-center" style={{ marginBottom: "3rem" }} data-aos="fade-down">
                <h1>All Projects</h1>
                <p>A collection of my work in Data Science, ML, and Full Stack Development.</p>
            </div>

            <div className="grid grid-3">
                {projects.map((project, index) => (
                    <div key={index} className="grid-item" data-aos="fade-up">
                        <h3>{project.title}</h3>
                        <div className="flex" style={{ gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                            {project.tech.map(t => (
                                <span key={t} className="tech-badge">{t}</span>
                            ))}
                        </div>
                        <p style={{ marginBottom: "1rem" }}>{project.desc}</p>
                        <a href={project.link} className="btn btn-outline" target="_blank" rel="noopener noreferrer">View Project</a>
                    </div>
                ))}
            </div>
        </div>
    );
}