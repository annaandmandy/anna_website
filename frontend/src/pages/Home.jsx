import React, { useEffect } from "react";
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
        <div className="container">
            {/* Hero Section */}
            <section className="hero" data-aos="fade-up">
                <div className="container grid grid-2 items-center">
                    <div className="hero-content">
                        <h1 className="hero-title">Hsiang Yu (Anna) Huang</h1>
                        <h2 className="hero-subtitle">Data Scientist & ML Engineer</h2>
                        <p style={{ fontSize: "1.2rem", marginBottom: "2rem", color: "var(--text-secondary)" }}>
                            I build machine learning systems, cloud pipelines, and full-stack tools that turn data into real impact.
                        </p>
                        <div className="flex">
                            <a href="#projects" className="btn btn-primary">View My Projects</a>
                            <a href="/resume.pdf" className="btn btn-outline" target="_blank">Download Resume</a>
                        </div>
                    </div>
                    <div>
                        <img
                            src="/img_main/anna_nobg.png"
                            alt="Anna"
                            style={{
                                width: "100%",
                                maxWidth: "400px",
                                height: "auto",
                                objectFit: "cover",
                                margin: "0 0 0 4rem",
                            }}
                        />
                    </div>
                </div>
                {/* Live2D is fixed at bottom right, so we leave this space open or add a visual element if needed */}
            </section>

            {/* About Section */}
            <section className="section" id="about" data-aos="fade-up">
                <h2 style={{ marginBottom: "2rem" }}>About Me</h2>
                <div className="grid grid-2">
                    <div>
                        <p style={{ marginBottom: "1rem" }}>
                            I am a Data Science Master's Student at Boston University, graduating in December 2025.
                            My background bridges finance, industrial management, and computer science, giving me a unique perspective on solving real-world problems.
                        </p>
                        <p>
                            I am actively seeking job opportunities in data science and analytics. Feel free to explore my projects and interests!
                        </p>
                    </div>
                    <div>
                        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Core Skills</h3>
                        <div className="flex" style={{ flexWrap: "wrap", gap: "0.5rem" }}>
                            {["Python", "Azure", "PyTorch", "React", "SQL", "Medallion Architecture", "Power BI"].map(skill => (
                                <span key={skill} className="tech-badge">{skill}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Projects */}
            <section className="section" id="projects">
                <h2 style={{ marginBottom: "3rem" }} data-aos="fade-up">Featured Projects</h2>

                <div className="project-item" data-aos="fade-up">
                    <h3 className="project-title">NVIDIA Stock Volume Forecast</h3>
                    <div className="project-meta">
                        <span>Azure Synapse</span>
                        <span>Medallion Architecture</span>
                        <span>Time Series</span>
                    </div>
                    <p>
                        Engineered a real-time data pipeline using Azure Synapse and Medallion Architecture to ingest tweet sentiment and forecast NVIDIA stock trading volume.
                    </p>
                    <div style={{ marginTop: "1rem" }}>
                        <a href="https://drive.google.com/file/d/1NYY6TYn6GqhrX9HX0D0ZWnrpZfo0DMal/view?usp=drive_link" target="_blank" style={{ fontWeight: "bold" }}>View Project →</a>
                    </div>
                </div>

                <div className="project-item" style={{ marginTop: "1rem" }} data-aos="fade-up">
                    <h3 className="project-title">Equity in Federal Budget Earmarking</h3>
                    <div className="project-meta">
                        <span>Senator Markey – Policy Data Analysis</span>
                        <span>Python</span>
                    </div>
                    <p>
                        Analyzed federal earmark funding data from Senator Markey’s public records to evaluate equity across Massachusetts communities. Extracted funding tables from Senate PDFs using Python and visualized disparities in per-capita allocations across regions.
                    </p>
                    <div style={{ marginTop: "1rem" }}>
                        <a href="https://drive.google.com/file/d/13AhXXN1NIwEa0Vb_eENFJmJzaaAD_k7x/view?usp=drive_link" target="_blank" style={{ fontWeight: "bold" }}>View Project →</a>
                    </div>
                </div>

                <div className="project-item" style={{ marginTop: "1rem" }} data-aos="fade-up">
                    <h3 className="project-title">Hybrid ARIMA–XGBoost Demand Forecasting</h3>
                    <div className="project-meta">
                        <span>GPU Supply Chain</span>
                        <span>ARIMA</span>
                        <span>XGBoost</span>
                        <span>Time Series</span>
                    </div>
                    <p>
                        Developed a hybrid ARIMA–XGBoost forecasting pipeline for a GPU component manufacturer. Built adaptive rolling-window models to handle seasonality and volatility, improving predictive accuracy from 8.3% → 73.4%.
                    </p>
                    <small style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>Details of this project are confidential due to an industry collaboration agreement.</small>
                </div>

                <div className="project-item" style={{ marginTop: "1rem" }} data-aos="fade-up">
                    <h3 className="project-title">Smart Vending Machine Shelf Optimization</h3>
                    <div className="project-meta">
                        <span>Retail Analytics</span>
                        <span>K-Means</span>
                        <span>Decision Trees</span>
                        <span>Python</span>
                    </div>
                    <p>
                        Clustered vending machine products using sales behavior and pricing metrics, then built a classification tree to identify shelf arrangements linked to high sales performance. Provided actionable recommendations to optimize product placement and profitability.
                    </p>

                    <small style={{ marginTop: "1rem", color: "var(--text-secondary)" }}>Details of this project are confidential due to an industry collaboration agreement.</small>
                </div>

                <div className="project-item" style={{ marginTop: "1rem" }} data-aos="fade-up">
                    <h3 className="project-title">Power System Load Forecasting</h3>
                    <div className="project-meta">
                        <span>Energy Analytics</span>
                        <span>SARIMAX</span>
                        <span>Neural Networks</span>
                    </div>
                    <p>
                        Forecasted Taiwan’s electricity demand using SARIMAX for long-term patterns and a Backpropagation Neural Network for short-term fluctuations. Achieved 69.4% accuracy and identified key holiday and seasonal consumption trends.
                    </p>
                    <div style={{ marginTop: "1rem" }}>
                        <a href="https://drive.google.com/file/d/1ymSMYf7Qc58ASLcXHSMZMMnxLYQvSIaI/view?usp=sharing" target="_blank" style={{ fontWeight: "bold" }}>View Project →</a>
                    </div>
                </div>

                <div className="project-item" style={{ marginTop: "1rem" }} data-aos="fade-up">
                    <h3 className="project-title">X-Decoder Optimization</h3>
                    <div className="project-meta">

                        <span>Deep Learning</span>
                        <span>Model Compression</span>
                    </div>
                    <p>
                        Optimizing deep learning models for low-power computer vision.
                    </p>
                    <div style={{ marginTop: "1rem" }}>
                        <a href="https://drive.google.com/file/d/1_N1JwI06ss6ebdgRwiY0lMvBKJr1KBB9/view?usp=sharing" target="_blank" style={{ fontWeight: "bold" }}>View Project →</a>
                    </div>
                </div>

                <div className="project-item" style={{ marginTop: "1rem" }} data-aos="fade-up">
                    <h3 className="project-title">RhettSearch – Gamified Research Engine</h3>
                    <div className="project-meta">
                        <span>🏆 Best Overall (DS+X Hackathon)</span>
                        <span>OpenAI</span>
                        <span>OpenAlex</span>
                        <span>React</span>
                    </div>
                    <p>
                        Built a gamified research engine using semantic search and AI recommendations to make academic research more engaging.
                        Designed a full-stack solution integrating OpenAI API for summaries and OpenAlex for citation data.
                    </p>
                    <div style={{ marginTop: "1rem" }}>
                        <a href="https://devpost.com/software/rhettsearch" target="_blank" style={{ fontWeight: "bold" }}>View Project →</a>
                    </div>
                </div>

                <div className="project-item" style={{ marginTop: "1rem" }} data-aos="fade-up">
                    <h3 className="project-title">U.S. Virtual Garden</h3>
                    <div className="project-meta">
                        <span>🏆 Dashboard Prize (CivilHack)</span>
                        <span>Groq API</span>
                        <span>Looker Studio</span>
                        <span>Data Viz</span>
                    </div>
                    <p>
                        Created an interactive dashboard visualizing U.S. Herbaria data. Used Groq API to generate dynamic descriptions and Looker Studio for high-impact visualizations.
                    </p>
                    <div style={{ marginTop: "1rem" }}>
                        <a href="https://devpost.com/software/virtual-garden-lfmqhy" target="_blank" style={{ fontWeight: "bold" }}>View Project →</a>
                    </div>
                </div>


            </section>

            {/* Experience */}
            <section className="section" id="experience" data-aos="fade-up">
                <h2 style={{ marginBottom: "2rem" }}>Experience</h2>

                <div className="experience-item">
                    <div className="experience-role">Full Stack Developer</div>
                    <div className="experience-company">Citale (BU Spark! Launch Lab) | 2025</div>
                    <p style={{ marginTop: "0.5rem" }}>
                        Developing a social platform for Boston events. Integrated Google Maps API and optimized SQL queries for search performance.
                    </p>
                </div>

                <div className="experience-item">
                    <div className="experience-role">Research Assistant</div>
                    <div className="experience-company">NTUST AI Lab | 2023–24</div>
                    <p style={{ marginTop: "0.5rem" }}>
                        Achieved 73.4% R² gain in sales forecasting models using rolling window adaptive modeling.
                    </p>
                </div>

                <div className="experience-item">
                    <div className="experience-role">Research Assistant</div>
                    <div className="experience-company">NTUST Stats Lab | 2023</div>
                    <p style={{ marginTop: "0.5rem" }}>
                        Developed shelf optimization models using K-means clustering to analyze product sales performance.
                    </p>
                </div>


            </section>

            {/* Contact */}
            <section className="section" id="contact" data-aos="fade-up">
                <h2 style={{ marginBottom: "2rem" }}>Get In Touch</h2>
                <div className="grid grid-2">
                    <div>
                        <p style={{ marginBottom: "1rem" }}>
                            I'm currently open to new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                        </p>
                        <div className="flex-col" style={{ gap: "1rem" }}>
                            <a href="mailto:annahuang@example.com" style={{ fontSize: "1.1rem" }}>📧 Email Me</a>
                            <a href="https://www.linkedin.com/in/hsiangyuhuang/" target="_blank" style={{ fontSize: "1.1rem" }}>🔗 LinkedIn</a>
                            <a href="https://github.com/annaandmandy" target="_blank" style={{ fontSize: "1.1rem" }}>💻 GitHub</a>
                        </div>
                    </div>

                    <form onSubmit={sendEmail} style={{ backgroundColor: "rgba(255,255,255,0.5)", padding: "2rem", borderRadius: "16px" }}>
                        <div className="form-group">
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Name</label>
                            <input type="text" name="name" className="form-input" required placeholder="Your Name" />
                        </div>
                        <div className="form-group">
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Email</label>
                            <input type="email" name="email" className="form-input" required placeholder="Your Email" />
                        </div>
                        <div className="form-group">
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>Message</label>
                            <textarea name="message" className="form-textarea" rows="4" required placeholder="Hello..."></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Send Message</button>
                    </form>
                </div>
            </section>
        </div>
    );
}
