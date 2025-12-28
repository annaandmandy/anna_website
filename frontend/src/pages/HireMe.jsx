import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import SkillsChart from "../components/SkillsChart";
import { useNavigate } from "react-router-dom";

export default function HireMe() {
    const navigate = useNavigate();

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    const handleSkillClick = (skillName) => {
        // Navigate to projects page with skill filter
        console.log(`Filtering projects by skill: ${skillName}`);
        navigate('/projects');
    };

    return (
        <div className="container">
            {/* Hero Section */}
            <section className="hero" data-aos="fade-up" style={{ minHeight: "60vh" }}>
                <div className="hero-content" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
                    <div className="availability-badge" style={{
                        display: "inline-block",
                        background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
                        color: "white",
                        padding: "0.5rem 1.5rem",
                        borderRadius: "25px",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        marginBottom: "2rem",
                        marginTop: "2rem",
                        boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)"
                    }}>
                        Available for Full-Time Roles • Feb 2026+
                    </div>
                    <h1 className="hero-title" style={{ fontSize: "3rem" }}>Work With Anna Huang</h1>
                    <h2 className="hero-subtitle">AI Engineer | Backend Engineer | Software Engineer</h2>
                    <p style={{ fontSize: "1.2rem", marginBottom: "2rem", color: "var(--text-secondary)", lineHeight: "1.8" }}>
                        Building production-grade AI systems and scalable backend infrastructure.
                        Specialized in Multi-Agent Systems, RAG Pipelines, FastAPI, and Cloud Architecture.
                    </p>
                    <div className="flex" style={{ gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="mailto:huanganna1004@gmail.com" className="btn btn-primary">📧 Email Me</a>
                        <a href="/resume.pdf" className="btn btn-outline" target="_blank">Download Resume</a>
                        <a href="https://www.linkedin.com/in/hsiangyuhuang/" className="btn btn-outline" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    </div>
                </div>
            </section>

            {/* What I'm Looking For */}
            <section className="section" id="looking-for" data-aos="fade-up">
                <h2 style={{ marginBottom: "2rem" }}>I'm Available For</h2>
                <div className="grid grid-3">
                    <div className="grid-item">
                        <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>✅ Backend Engineer</h3>
                        <p>Building scalable APIs, microservices, and database architectures. Expert in FastAPI, Python, SQL, cloud deployment (AWS, Azure, Cloudflare), MongoDB, and RESTful design.</p>
                    </div>
                    <div className="grid-item">
                        <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>✅ AI Engineer</h3>
                        <p>Designing and deploying multi-agent systems, RAG pipelines, and LLM applications. Specialized in LangGraph, vector databases, and production AI.</p>
                    </div>
                    <div className="grid-item">
                        <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>✅ Software Engineer</h3>
                        <p>Full-stack development with modern frameworks. Strong foundation in React, Next.js, and DevOps. Experience in OOP structure and system design using C++.</p>
                    </div>
                </div>
            </section>

            {/* What I Bring */}
            <section className="section" id="value" data-aos="fade-up">
                <h2 style={{ marginBottom: "2rem" }}>What I Bring to Your Team</h2>
                <div className="grid grid-2">
                    <div>
                        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>💡 Production AI Systems at Scale</h3>
                        <p style={{ marginBottom: "1.5rem" }}>
                            Built a multi-agent LLM platform using FastAPI and LangGraph managing asynchronous communication between Coordinator, Writer, and Product agents. Architected RAG pipelines for RhettSearch (DS+X Hackathon Winner) that retrieves academic literature via OpenAlex API and synthesizes insights using OpenAI.
                        </p>

                        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>⚡ Data-Driven Engineering Results</h3>
                        <p style={{ marginBottom: "1.5rem" }}>
                            Proven track record of measurable impact: improved forecasting accuracy from 8.3% to 73.4% R² using ARIMA-XGBoost pipeline. Designed normalized PostgreSQL schemas and built 10+ features processing user interactions and location data for Citale, now serving real users.
                        </p>
                    </div>
                    <div>
                        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>🚀 Full-Stack Cloud Infrastructure</h3>
                        <p style={{ marginBottom: "1.5rem" }}>
                            End-to-end deployment experience across AWS (Lambda, Step Functions, EC2, S3) and Azure ecosystems. Built serverless ETL pipelines for real-time event ingestion and deployed EC2-based web scrapers with Cron automation for reliable data extraction.
                        </p>

                        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>📊 Rapid Prototyping to Production</h3>
                        <p>
                            Hackathon winner (DS+X 2025 - Best Overall) with proven ability to ship fast. Managed weekly Agile Sprints deploying to Vercel with PostHog analytics integration. Designed RESTful APIs handling complex JSON serialization for frontend integration.
                        </p>
                    </div>
                </div>
            </section>

            {/* Skills Section with Interactive Chart */}
            <section className="section" id="skills" data-aos="fade-up">
                <SkillsChart onSkillClick={handleSkillClick} />
            </section>

            {/* Ideal Role */}
            <section className="section" id="ideal-role" data-aos="fade-up">
                <div style={{ backgroundColor: "var(--bg-secondary)", padding: "3rem", borderRadius: "16px", textAlign: "center" }}>
                    <h2 style={{ marginBottom: "1.5rem" }}>My Ideal Role</h2>
                    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
                        <p style={{ fontSize: "1.1rem", lineHeight: "1.8", marginBottom: "1rem" }}>
                            I thrive in environments where I can build intelligent systems that solve real problems—whether that's architecting multi-agent workflows, optimizing backend infrastructure, or deploying cloud-native AI applications.
                        </p>
                        <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
                            I'm looking for collaborative teams that value <strong>production-ready code</strong>, <strong>scalable architectures</strong>, and <strong>measurable impact</strong>.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ for AI Search Engines */}
            <section className="section faq-section" id="faq" data-aos="fade-up">
                <h2 style={{ marginBottom: "2rem", textAlign: "center" }}>Frequently Asked Questions</h2>
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                    <div className="faq-item" style={{ marginBottom: "2rem", padding: "1.5rem", backgroundColor: "var(--bg-secondary)", borderRadius: "12px" }}>
                        <h3 style={{ fontSize: "1.15rem", marginBottom: "0.75rem" }}>What engineering roles is Anna seeking?</h3>
                        <p>
                            I'm actively seeking Backend Engineer, AI Engineer, Software Engineer, and Data Engineer roles starting May 2026. My expertise spans multi-agent AI systems, RAG pipelines, FastAPI backend development, cloud infrastructure (AWS/Azure), and full-stack web applications.
                        </p>
                    </div>

                    <div className="faq-item" style={{ marginBottom: "2rem", padding: "1.5rem", backgroundColor: "var(--bg-secondary)", borderRadius: "12px" }}>
                        <h3 style={{ fontSize: "1.15rem", marginBottom: "0.75rem" }}>What are Anna's core technical strengths?</h3>
                        <p>
                            My primary strengths include: <strong>AI Engineering</strong> (LangGraph, Multi-Agent Systems, RAG Pipelines, Vector Databases), <strong>Backend Engineering</strong> (FastAPI, Python, REST APIs, Microservices, SQL, MongoDB), <strong>Cloud Infrastructure</strong> (AWS Lambda/S3/EC2, Azure, Docker, Serverless Architecture), and <strong>Full Stack Development</strong> (React, Next.js, JavaScript).
                        </p>
                    </div>

                    <div className="faq-item" style={{ marginBottom: "2rem", padding: "1.5rem", backgroundColor: "var(--bg-secondary)", borderRadius: "12px" }}>
                        <h3 style={{ fontSize: "1.15rem", marginBottom: "0.75rem" }}>What makes Anna's AI engineering experience unique?</h3>
                        <p>
                            I specialize in production-grade AI systems, not just model development. I've built complete multi-agent orchestration platforms with observability backends, deployed serverless AI applications on Cloudflare Workers, and optimized RAG pipelines for 10,000+ daily queries with &lt;1s retrieval time and 95% accuracy.
                        </p>
                    </div>

                    <div className="faq-item" style={{ marginBottom: "2rem", padding: "1.5rem", backgroundColor: "var(--bg-secondary)", borderRadius: "12px" }}>
                        <h3 style={{ fontSize: "1.15rem", marginBottom: "0.75rem" }}>Does Anna have experience with Large Language Models?</h3>
                        <p>
                            Yes, I have extensive experience building LLM applications using LangGraph, OpenAI API, and custom RAG systems. My projects include multi-agent novel generators, intelligent research platforms, and contextual retrieval systems—all deployed in production environments.
                        </p>
                    </div>

                    <div className="faq-item" style={{ padding: "1.5rem", backgroundColor: "var(--bg-secondary)", borderRadius: "12px" }}>
                        <h3 style={{ fontSize: "1.15rem", marginBottom: "0.75rem" }}>What is Anna's education background?</h3>
                        <p>
                            Master's student at Boston University specializing in Backend Engineering and Cloud Infrastructure (expected May 2026). Previously completed Bachelor's at National Taiwan University of Science and Technology with research in AI and time series forecasting, achieving a 73.4% R² improvement in demand prediction models.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section className="section" id="contact" data-aos="fade-up">
                <div style={{ textAlign: "center", backgroundColor: "var(--primary-color)", padding: "4rem 2rem", borderRadius: "20px" }}>
                    <h2 style={{ marginBottom: "1.5rem" }}>Let's Build Something Great Together</h2>
                    <p style={{ fontSize: "1.1rem", marginBottom: "2rem", maxWidth: "600px", margin: "0 auto 2rem auto" }}>
                        I'm excited to discuss how I can contribute to your team. Whether you have questions, want to see more of my work, or just want to chat about AI and backend engineering—I'd love to hear from you!
                    </p>
                    <div className="flex" style={{ gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="mailto:huanganna1004@gmail.com" style={{ fontSize: "1.1rem", fontWeight: "600" }}>📧 huanganna1004@gmail.com</a>
                        <span style={{ color: "var(--text-secondary)" }}>•</span>
                        <a href="https://www.linkedin.com/in/hsiangyuhuang/" target="_blank" rel="noopener noreferrer" style={{ fontSize: "1.1rem", fontWeight: "600" }}>💼 LinkedIn</a>
                        <span style={{ color: "var(--text-secondary)" }}>•</span>
                        <a href="https://github.com/annaandmandy" target="_blank" rel="noopener noreferrer" style={{ fontSize: "1.1rem", fontWeight: "600" }}>💻 GitHub</a>
                    </div>
                </div>
            </section>
        </div>
    );
}
