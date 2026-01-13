import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Interests() {
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    return (
        <div className="container section">
            <div className="text-center" style={{ marginBottom: "3rem", marginTop: "3rem" }} data-aos="fade-down">
                <h1>Interests</h1>
            </div>
            <div className="grid-item" data-aos="fade-up" style={{ maxWidth: "800px", margin: "0 auto" }}>
                <p style={{ marginBottom: "1rem" }}>I am also interested in drawing and designing. Here are some of the works.</p>
                <ul className="nav-links flex-col" style={{ gap: "0.5rem" }}>
                    <li>
                        <a href="/gorillacharms" className="nav-link">Gorilla Charms</a>
                    </li>
                    <li>
                        <a href="/booklet" className="nav-link">Booklet</a>
                    </li>
                    <li>
                        <a href="https://huanghybu.cargo.site/" className="nav-link" target="_blank" rel="noopener noreferrer">Collages</a>
                    </li>
                </ul>
            </div>
        </div>
    );
}
//