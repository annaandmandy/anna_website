import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // Add shadow on scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Projects", path: "/projects" },
        { name: "Blogs", path: "/blogs" },
        { name: "Weekend Report", path: "/weekend_report" },
    ];

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <img
                        src="/img_main/IMG_0505.PNG"
                        alt="Logo"
                        className="w-10 h-10 object-cover rounded-full shadow-sm border border-stone-200 group-hover:rotate-12 transition-transform"
                    />
                    <span className="font-bold text-lg text-dark tracking-tight">Anna's Website</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`text-sm font-bold transition-colors ${location.pathname === link.path
                                ? "text-primary"
                                : "text-text-secondary hover:text-dark"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <a
                        href="https://github.com/annaandmandy/Skill_demonstration"
                        target="_blank"
                        className="text-sm font-bold text-text-secondary hover:text-dark flex items-center gap-1"
                    >
                        GitHub
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-dark"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span className="material-symbols-outlined text-2xl">
                        {isMenuOpen ? "close" : "menu"}
                    </span>
                </button>
            </div>

            {/* Mobile Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-stone-100 shadow-xl py-4 px-6 flex flex-col gap-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="text-dark font-bold py-2 border-b border-stone-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}