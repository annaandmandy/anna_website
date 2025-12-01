import React from "react";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <p style={{ marginBottom: "1rem", fontWeight: "500" }}>Welcome to connect with me.</p>
                <div className="flex" style={{ justifyContent: "center", gap: "2rem" }}>
                    <a href="/resume.pdf" className="flex items-center" style={{ color: "var(--text-primary)" }}>
                        <img
                            src="https://img.icons8.com/?size=100&id=SnwGrzYElOwk&format=png&color=000000"
                            alt="CV"
                            width="20"
                            height="20"
                            style={{ marginRight: "0.5rem" }}
                        />
                        CV
                    </a>
                    <a
                        href="https://github.com/annaandmandy/Skill_demonstration"
                        className="flex items-center"
                        style={{ color: "var(--text-primary)" }}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                            alt="GitHub"
                            width="20"
                            height="20"
                            style={{ marginRight: "0.5rem" }}
                        />
                        GitHub
                    </a>
                    <a
                        href="https://www.linkedin.com/in/hsiangyuhuang/"
                        className="flex items-center"
                        style={{ color: "var(--text-primary)" }}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
                            alt="LinkedIn"
                            width="20"
                            height="20"
                            style={{ marginRight: "0.5rem" }}
                        />
                        LinkedIn
                    </a>
                </div>
            </div>
        </footer>
    );
}