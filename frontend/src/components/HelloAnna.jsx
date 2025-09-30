import React from "react";

export default function HelloAnna() {
    return (
        <div className="container5" style={{ backgroundColor: "#fffceb" }}>
            <div className="row align-items-center g-4 px-5">
                {/* Brief Introduction Section */}
                <div className="col-lg-6">
                    <div className="p-4 bg-white border border-dark rounded position-relative">
                        <h1 className="h4 fw-bold mb-3">Brief Introduction</h1>
                        <p className="mb-2">Hello, my name is Hsiang Yu Huang, you can just call me Anna.</p>
                        <p className="mb-2">I am a Data Science Master Student in Boston University.</p>
                        <p>
                            I am actively seeking internships in data science, data analytics, data engineering, or software engineering.
                        </p>
                    </div>
                </div>

                {/* Welcome Image Section */}
                <div className="col-lg-6 text-center">
                    <img
                        src="src/assets/anna-welcome.png"
                        alt="anna-welcome"
                        className="img-fluid"
                        style={{ maxWidth: "500px" }}
                    />
                </div>
            </div>
        </div>
    );
}