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
                        <Link to="/projects" className="nav-link">Projects</Link>
                    </li>

                    <li><Link to="/interests" className="nav-link">Interests</Link></li>
                    <li><Link to="/weekend_report" className="nav-link">Weekend Report</Link></li>
                    <li><a href="https://github.com/annaandmandy/Skill_demonstration" className="nav-link">GitHub</a></li>
                </ul>
            </div>
        </nav>
    );
}