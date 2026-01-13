import React, { useEffect } from 'react';
import AOS from "aos";
import "aos/dist/aos.css";
import SEO from "../components/SEO";

export default function Booklet() {
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    return (
        <div className="container section">
            <SEO
                title="Foundation Design Booklet - Hsiang Yu (Anna) Huang"
                description="Interactive digital flipbook showcasing my final project for AR123 Foundation Design."
                name="Hsiang Yu Huang"
                type="article"
            />
            <div className="text-center" style={{ marginBottom: "3rem", marginTop: "3rem" }} data-aos="fade-down">
                <h1>Booklet</h1>
                <p>Final Project from AR123 Foundation Design.</p>
            </div>

            <div className="grid-item" style={{ padding: "0", overflow: "hidden", height: "800px", position: "relative" }}>
                <iframe
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        border: "none"
                    }}
                    src="https://online.fliphtml5.com/mypage/sgvq/"
                    seamless="seamless"
                    scrolling="no"
                    frameBorder="0"
                    allowTransparency="true"
                    allowFullScreen="true"
                />
            </div>
        </div>
    );
};