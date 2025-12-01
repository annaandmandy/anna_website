import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                {/* Brand Logo */}
                <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "var(--text-primary)", fontWeight: "bold", fontSize: "1.2rem" }}>
                    <img
                        src="/img_main/IMG_0505.PNG"
                        alt="Logo"
                        width="30"
                        height="30"
                        style={{ marginRight: "10px" }}
                    />
                    <span>Anna's Website</span>
                </Link>

                {/* Mobile Toggle */}
                <button
                    className="btn"
                    style={{ display: "none" }} // Hidden on desktop, need media query to show on mobile
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    ☰
                </button>

                {/* Navbar Links */}
                <ul className="nav-links" style={{ display: "flex", alignItems: "center", gap: "2rem", margin: 0, padding: 0 }}>
                    <li><Link to="/" className="nav-link">Home</Link></li>
                    <li><Link to="/about" className="nav-link">About</Link></li>

                    {/* Projects Dropdown */}
                    <li style={{ position: "relative" }}
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        <Link to="/projects" className="nav-link" style={{ cursor: "pointer" }}>Projects ▾</Link>
                        {isDropdownOpen && (
                            <ul style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                backgroundColor: "white",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                listStyle: "none",
                                padding: "1rem",
                                borderRadius: "8px",
                                width: "250px",
                                zIndex: 1000
                            }}>
                                <li style={{ marginBottom: "0.5rem" }}><a href="https://github.com/annaandmandy/Skill_demonstration" target="_blank" className="nav-link" style={{ fontSize: "0.9rem" }}>Overall</a></li>
                                <li style={{ marginBottom: "0.5rem" }}><a href="https://github.com/annaandmandy/25LPCVC_Track2_Segmentation_Sample_Solution" target="_blank" className="nav-link" style={{ fontSize: "0.9rem" }}>25LPCVC_Track2 Project</a></li>
                                <li style={{ marginBottom: "0.5rem" }}><a href="https://www.citaleco.com" target="_blank" className="nav-link" style={{ fontSize: "0.9rem" }}>Citale Website</a></li>
                                <li style={{ marginBottom: "0.5rem" }}><a href="https://github.com/annaandmandy/ds598_azure/tree/hw" target="_blank" className="nav-link" style={{ fontSize: "0.9rem" }}>Big Data Engineering HW</a></li>
                                <li style={{ marginBottom: "0.5rem" }}><a href="https://strickds.com/" target="_blank" className="nav-link" style={{ fontSize: "0.9rem" }}>Strick Data Solutions</a></li>
                                <li style={{ marginBottom: "0.5rem" }}><a href="https://drive.google.com/file/d/1UmiLAO-Hok-t_WhGOM4XEx5YTtSEzRei/view" target="_blank" className="nav-link" style={{ fontSize: "0.9rem" }}>C++ Game Demo</a></li>
                                <li style={{ marginBottom: "0.5rem" }}><a href="https://devpost.com/software/rhettsearch" target="_blank" className="nav-link" style={{ fontSize: "0.9rem" }}>RhettSearch (Hackathon)</a></li>
                                <li><a href="https://devpost.com/software/virtual-garden-lfmqhy" target="_blank" className="nav-link" style={{ fontSize: "0.9rem" }}>U.S. Virtual Garden</a></li>
                            </ul>
                        )}
                    </li>

                    <li><Link to="/interests" className="nav-link">Interests</Link></li>
                    <li><Link to="/weekend_report" className="nav-link">Weekend Report</Link></li>
                </ul>
            </div>
        </nav>
    );
}