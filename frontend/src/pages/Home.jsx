import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import emailjs from "emailjs-com";

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
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
    <div className="container-fluid py-3" style={{ backgroundColor: "#fffceb" }}>
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-center mb-5" data-aos="fade-down">
            <div className="d-flex flex-column justify-content-center text-center text-md-start mb-3 mb-md-0 ms-md-5">
                <h1 className="fw-bold mb-3 mt-5">Welcome to My Website</h1>
                <h2 className="mb-3">Hsiang Yu Huang</h2>
                <h3 className="mb-3">Anna</h3>
                <p className="mb-3">I am a Data Science Master's Student at Boston University (graduating December 2025).  </p>
                <p className="mb-3">I am actively seeking job opportunities in data science and analytics.</p>
                <p>Feel free to explore my projects and interests!</p>

            </div>    
            <div>
                <img
                src="/img_main/anna_nobg.png"
                alt="Anna"
                style={{
                    width: "400px",
                    height: "auto",
                    objectFit: "cover",
                }}
                />
            </div>     
        </div>
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-center mt-5" data-aos="fade-up">
            <h2 className="fw-bold mb-3">Projects</h2>
        </div>
        <div className="row g-4 d-flex align-items-stretch justify-content-center" style={{ width: "90%", margin: "0 auto", maxWidth: "1200px"  }}>
            {/* Project Card */}
            <div className="col-md-6 col-lg-4" data-aos="fade-up">
                <div className="card h-100 shadow-sm"  style={{backgroundColor: "rgb(250, 247, 217)", borderTop: "6px solid #FFD93D"}}>
                    <div className="card-body">
                        <h3 className="h5 fw-bold ms-3 mb-3">Citale</h3>
                        <p className="card-text ms-3">
                            A social media platform for finding things to do in Boston.
                        </p>
                        <li className="card-text ms-4">Developed a Boston-based social platform with event recommendations and user networking features.</li>
                        <li className="card-text ms-4 mb-3">Integrated Google Maps API for event geolocation and enhanced SQL-based search performance.</li>
                        <a
                            href="https://www.bu.edu/spark/citale/"
                            className="btn btn-outline-danger d-flex justify-content-center"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Citale
                        </a>
                    </div>
                </div>
            </div>
            {/* Project Card */}
            <div className="col-md-6 col-lg-4" data-aos="fade-up">
                <div className="card h-100 shadow-sm"  style={{backgroundColor: "rgb(250, 247, 217)", borderTop: "6px solid #FFD93D"}}>
                    <div className="card-body">
                        <h3 className="h5 fw-bold ms-3 mb-2">Research Projects</h3>
                        <li className="fw-bold card-text ms-4 mb-1">Machine learning for sales forecast in graphic card manufacturing</li>
                        <small className="card-text fs-6">Developed a conditional rolling window model for adaptive forecasting with real-time updates.</small>
                        <li className="fw-bold card-text ms-4 mb-1"> The Deployment and Shelf Analysis Recommendations for Smart Vending Machines</li>
                        <small className="card-text fs-6">Clustered products by sales using K-means with metrics like mean, CV, revenue, and unit price</small>
                    </div>
                </div>
            </div>
            {/* Project Card */}
            <div className="col-md-6 col-lg-4" data-aos="fade-up">
                <div className="card h-100 shadow-sm"  style={{backgroundColor: "rgb(250, 247, 217)", borderTop: "6px solid #FFD93D"}}>
                    <div className="card-body">
                        <h3 className="h5 fw-bold ms-3 mb-3">Looker Studio</h3>
                        <p className="card-text ms-3 mb-4">
                            CivilHack Hackathon: U.S. Virtual Museum
                        </p>
                        <li className="card-text ms-4 mb-2">Analysis U.S. Herbaria Data.</li>
                        <li className="card-text ms-4 mb-2">Dataset From Harvard University Herbaria and Library.</li>
                        <li className="card-text ms-4 mb-3">Demonstrated proficiency in Looker Studio for data visualization.</li>
                        <a
                            href="https://lookerstudio.google.com/u/0/reporting/adfca0fd-e895-455c-8610-d5b5fc8b345d/page/UmyZF?s=s7PMLAcTKJI"
                            className="btn btn-outline-primary d-flex justify-content-center"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Looker Studio
                        </a>
                    </div>
                </div>
            </div>
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-center mt-5" data-aos="fade-up">
                <h2 className="fw-bold mb-4 mt-3">Contact Me!</h2>
            </div>
            <div
                className="d-flex flex-row align-items-center justify-content-center mb-5"
                data-aos="fade-up"
                style={{backgroundColor: "rgb(250, 247, 217)", padding: "20px", borderRadius: "8px", borderTop: "6px solid #FFD93D", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    maxWidth: "700px", width: "90%", margin: "0 auto"
                }}
                >
                <form onSubmit={sendEmail} className="form-container" style={{ width: "100%", maxWidth: "400px" }}>
                    {/* Name */}
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                            Name:
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-control"
                            placeholder="Your Name"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Your Email"
                            required
                        />
                    </div>

                    {/* Message */}
                    <div className="mb-3">
                        <label htmlFor="message" className="form-label">
                            Message:
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            className="form-control"
                            rows="5"
                            placeholder="Write your message here..."
                            required
                        ></textarea>
                    </div>

                    {/* Submit */}
                    <div className="text-center">
                        <button type="submit" className="btn" style={{ backgroundColor: "#FFD93D" }}>
                            Send Message
                        </button>
                    </div>
                </form>
            </div>
         </div>
    </div>
    
  );
}
