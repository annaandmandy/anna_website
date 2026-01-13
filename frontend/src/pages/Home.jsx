import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import emailjs from "emailjs-com";

export default function Home() {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    function sendEmail(e) {
        e.preventDefault();

        emailjs.sendForm(
            import.meta.env.VITE_SERVICE_ID,
            import.meta.env.VITE_TEMPLATE_ID,
            e.target,
            import.meta.env.VITE_PUBLIC_KEY
        ).then(
            (result) => {
                alert("Message sent!");
                e.target.reset();
            },
            (error) => {
                alert("Failed: " + error.text);
            }
        );
    }

    return (
        <div className="flex flex-col gap-20 pb-32 overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-20 md:pt-32 px-6 max-w-7xl mx-auto w-full" data-aos="fade-up">

                {/* Background Decor */}
                <div className="absolute top-0 right-0 -z-10 opacity-30 pointer-events-none">
                    <div className="w-96 h-96 bg-primary rounded-full blur-3xl mix-blend-multiply filter animate-blob"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="flex flex-col gap-8">
                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-stone-100 self-start">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider text-stone-600">Open for AI Roles</span>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-dark leading-[1.1]">
                                Hi, I'm Anna. <br />
                                <span className="text-primary italic">AI Engineer</span> who builds systems that <span className="underline decoration-primary decoration-4 underline-offset-4">work</span>.
                            </h1>
                            <p className="text-lg md:text-xl text-text-secondary max-w-lg leading-relaxed">
                                I specialize in multi-agent workflows, RAG systems, and scalable backend infrastructure. I turn "AI demos" into production-grade solutions.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-2">
                            <a href="#projects" className="px-8 py-4 bg-primary text-dark rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                                View Projects
                            </a>
                            <a href="/resume.pdf" target="_blank" className="px-8 py-4 bg-white border border-stone-200 text-dark rounded-xl font-bold text-lg hover:border-dark transition-colors">
                                Resume
                            </a>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Image Container with Organic Feel */}
                        <div className="relative z-10 p-4 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl rotate-2 hover:rotate-0 transition-transform duration-500">
                            <img
                                src="/img_main/anna_nobg.png"
                                alt="Hsiang Yu (Anna) Huang"
                                className="w-full h-auto bg-gradient-to-b from-primary/20 to-transparent rounded-2xl"
                            />
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/30 rounded-full blur-xl -z-10"></div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="bg-white py-24 px-6" id="about">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-12">
                        <span className="h-px w-12 bg-dark"></span>
                        <span className="font-bold text-sm tracking-widest uppercase text-text-secondary">The Engineer</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-20">
                        <div className="space-y-6 text-lg leading-relaxed text-text-secondary">
                            <h2 className="text-3xl font-bold text-dark mb-4">Bridging Research & Production</h2>
                            <p>
                                I am an MS student at <strong>Boston University</strong> with a focus that goes beyond just training models. I care about <strong>inference speed</strong>, <strong>infrastructure costs</strong>, and <strong>user experience</strong>.
                            </p>
                            <p>
                                While others stop at the Jupyter Notebook, I architect <strong>FastAPI</strong> services, optimize <strong>Postgres</strong> queries, and deploy to <strong>AWS/Azure</strong> to make sure the AI actually solves the problem in the real world.
                            </p>
                            <div className="pt-4">
                                <Link to="/hire-me" className="inline-flex items-center gap-2 font-bold text-dark border-b-2 border-primary hover:bg-primary/20 transition-colors">
                                    Read my work status & availability →
                                </Link>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">terminal</span>
                                Technical Arsenal
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    "Python", "FastAPI", "LangGraph", "Multi-Agent Systems",
                                    "RAG Pipelines", "AWS Serverless", "Docker", "PostgreSQL",
                                    "React", "System Design", "Vector DBs"
                                ].map((skill) => (
                                    <span key={skill} className="px-4 py-2 bg-background-light border border-stone-200 rounded-lg text-sm font-semibold hover:border-primary transition-colors cursor-default">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Projects */}
            <section className="max-w-6xl mx-auto px-6" id="projects">
                <div className="flex justify-between items-end mb-20">
                    <div>
                        <h2 className="text-4xl font-extrabold mb-4">Selected Work</h2>
                        <p className="text-text-secondary text-lg">A collection of intelligent systems.</p>
                    </div>
                    {/* Visual decoration line */}
                    <div className="hidden md:block h-px flex-1 bg-stone-200 ml-12 mb-4"></div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {/* Project 1 */}
                    <div className="bg-white rounded-2xl p-8 border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group" data-aos="fade-up">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-2 py-1 bg-primary/20 text-xs font-bold uppercase rounded">FastAPI</span>
                            <span className="px-2 py-1 bg-primary/20 text-xs font-bold uppercase rounded">RAG</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-amber-600 transition-colors">LLM Research Platform</h3>
                        <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                            Architected a multi-agent system to orchestrate complex contextual retrieval workflows for research. Features a custom "Product-Enrichment" pipeline logged via high-performance FastAPI backend.
                        </p>
                        <a href="https://llm-platform.vercel.app" target="_blank" className="font-bold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all">
                            Live Demo
                        </a>
                    </div>

                    {/* Project 3 */}
                    <div className="bg-white rounded-2xl p-8 border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group" data-aos="fade-up" data-aos-delay="200">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-2 py-1 bg-primary/20 text-xs font-bold uppercase rounded">Azure</span>
                            <span className="px-2 py-1 bg-primary/20 text-xs font-bold uppercase rounded">Medallion</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-amber-600 transition-colors">NVIDIA Volume Forecast</h3>
                        <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                            Real-time data pipeline using Azure Synapse and Medallion Architecture to ingest tweet sentiment and forecast trading volume.
                        </p>
                        <a href="https://drive.google.com/file/d/1NYY6TYn6GqhrX9HX0D0ZWnrpZfo0DMal/view?usp=drive_link" target="_blank" className="font-bold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all">
                            Case Study
                        </a>
                    </div>

                    {/* Project 5 */}
                    <div className="bg-white rounded-2xl p-8 border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group" data-aos="fade-up" data-aos-delay="100">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-bold uppercase rounded">Hackathon Winner</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-amber-600 transition-colors">RhettSearch Engine</h3>
                        <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                            <b>Best Overall @ DS+X Hackathon.</b> Gamified research engine utilizing OpenAlex and OpenAI for semantic search and paper summarization.
                        </p>
                        <a href="https://devpost.com/software/rhettsearch" target="_blank" className="font-bold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all">
                            See Project
                        </a>
                    </div>

                    {/* Personal/Weekend */}
                    <div className="bg-primary/10 rounded-2xl p-8 border border-primary/20 shadow-none hover:shadow-md transition-all duration-300 group flex flex-col justify-center items-center text-center" data-aos="fade-up" data-aos-delay="200">
                        <div className="w-16 h-16 bg-primary text-dark rounded-full flex items-center justify-center mb-4 text-3xl">
                            🎨
                        </div>
                        <h3 className="text-xl font-bold mb-2">Weekend Labs</h3>
                        <p className="text-text-secondary text-sm mb-6">
                            Where I experiment with new agents, games, and designs. Check out my latest weekend reports!
                        </p>
                        <Link to="/weekend_report" className="px-6 py-2 bg-primary text-dark font-bold rounded-lg hover:brightness-110 transition-all">
                            Visit The Lab
                        </Link>
                    </div>

                </div>
            </section>

            {/* Personal / Fun Section */}\
            {/*}
            <section className="py-20 px-6 bg-white overflow-hidden">
                <div className="max-w-4xl mx-auto bg-stone-900 rounded-3xl p-12 md:p-16 relative text-center text-white">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl z-0 opacity-20">
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
                        <div className="absolute top-1/2 right-0 w-80 h-80 bg-purple-500 rounded-full blur-3xl mix-blend-overlay"></div>
                    </div>

                    <div className="relative z-10">
                        <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-white/20">
                            Beyond Code
                        </span>
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-8">
                            "I build agents that feel human."
                        </h2>
                        <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold opacity-80">
                            <span className="flex items-center gap-2">✨ Live2D Enthusiast</span>
                            <span className="flex items-center gap-2">📚 Sci-Fi Novel Generator</span>
                            <span className="flex items-center gap-2">🎹 Piano Player</span>
                        </div>
                        <div className="mt-10">
                            <Link to="/interests" className="inline-flex items-center gap-2 font-bold hover:text-primary transition-colors">
                                Explore My Interests
                            </Link>
                        </div>
                    </div>
                </div>
            </section> /*}

            {/* Experience Section */}
            <section className="bg-white py-12 px-6" id="experience" data-aos="fade-up">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-extrabold mb-12">Experience</h2>

                    <div className="space-y-12">
                        <div className="pl-6 border-l-2 border-primary">
                            <h3 className="text-2xl font-bold">AI Engineer Intern</h3>
                            <div className="text-text-secondary font-medium mb-2">Finz | 2025</div>
                            <p className="text-lg leading-relaxed">
                                Refactored the backend infrastructure of a financial AI platform, optimizing Kafka pipelines to handle high-throughput webhooks and real-time forecasting.
                            </p>
                        </div>

                        <div className="pl-6 border-l-2 border-stone-200 hover:border-primary transition-colors">
                            <h3 className="text-2xl font-bold">Research Assistant</h3>
                            <div className="text-text-secondary font-medium mb-2">BU BIT Lab | 2025</div>
                            <p className="text-lg leading-relaxed">
                                Developed a LLM Platform for GEO experiments using LangGraph, specialized for shopping and product recommendations.
                            </p>
                        </div>

                        <div className="pl-6 border-l-2 border-stone-200 hover:border-primary transition-colors">
                            <h3 className="text-2xl font-bold">Full Stack Developer</h3>
                            <div className="text-text-secondary font-medium mb-2">Citale (BU Spark! Launch Lab) | 2024-25</div>
                            <p className="text-lg leading-relaxed">
                                Developed a social platform for Boston events. Integrated Google Maps API and optimized SQL queries for search performance.
                            </p>
                        </div>

                        <div className="pl-6 border-l-2 border-stone-200 hover:border-primary transition-colors">
                            <h3 className="text-2xl font-bold">Research Assistant</h3>
                            <div className="text-text-secondary font-medium mb-2">NTUST AI Lab | 2023–24</div>
                            <p className="text-lg leading-relaxed">
                                Achieved 73.4% R² gain in sales forecasting models using rolling window adaptive modeling.
                            </p>
                        </div>

                        <div className="pl-6 border-l-2 border-stone-200 hover:border-primary transition-colors">
                            <h3 className="text-2xl font-bold">Research Assistant</h3>
                            <div className="text-text-secondary font-medium mb-2">NTUST Stats Lab | 2023</div>
                            <p className="text-lg leading-relaxed">
                                Developed shelf optimization models using K-means clustering to analyze product sales performance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section - Restored Form */}
            <section className="py-12 px-6" id="contact" data-aos="fade-up">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-start">
                    {/* Left Column */}
                    <div>
                        <h2 className="text-4xl font-extrabold mb-6">Let's Chat</h2>
                        <p className="text-xl text-text-secondary mb-10 leading-relaxed">
                            I'm currently seeking roles in <span className="font-bold">AI Engineering</span> and <span className="font-bold">Backend Systems</span>. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                        </p>

                        <div className="space-y-6">
                            <a href="mailto:huanganna1004@gmail.com" className="flex items-center gap-4 text-lg font-bold hover:text-primary transition-colors">
                                <span className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-stone-100">
                                    <span className="material-symbols-outlined">mail</span>
                                </span>
                                huanganna1004@gmail.com
                            </a>
                            <a href="https://www.linkedin.com/in/hsiangyuhuang/" target="_blank" className="flex items-center gap-4 text-lg font-bold hover:text-primary transition-colors">
                                <span className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-stone-100">
                                    <span className="material-symbols-outlined">link</span>
                                </span>
                                LinkedIn Profile
                            </a>
                            <a href="https://github.com/annaandmandy" target="_blank" className="flex items-center gap-4 text-lg font-bold hover:text-primary transition-colors">
                                <span className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-stone-100">
                                    <span className="material-symbols-outlined">code</span>
                                </span>
                                GitHub Portfolio
                            </a>
                        </div>
                    </div>

                    {/* Right Column - Functional Form */}
                    <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-stone-100">
                        <form onSubmit={sendEmail} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-dark mb-2 uppercase tracking-wide">Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="What should I call you?"
                                    className="w-full p-4 bg-background-light border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-dark mb-2 uppercase tracking-wide">Your Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="email@example.com"
                                    className="w-full p-4 bg-background-light border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-dark mb-2 uppercase tracking-wide">Message</label>
                                <textarea
                                    name="message"
                                    required
                                    rows="4"
                                    placeholder="Tell me about your project..."
                                    className="w-full p-4 bg-background-light border border-stone-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-medium resize-none"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-primary text-dark font-extrabold text-lg rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] hover:shadow-xl transition-all active:scale-[0.98]"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
