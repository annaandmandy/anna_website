import React from "react";

export default function Footer() {
    return (
        <footer className="text-black py-2 mt-auto" style={{ backgroundColor: "#FFD93D"}}>
            <div className="container text-center">
                <p className="mb-0">Welcome to connect with me.</p>
                <p className="mb-0 d-flex justify-content-center align-items-center gap-3">
                    <a href="/resume.pdf" className="text-black text-decoration-none">
                        <img
                            src="https://img.icons8.com/?size=100&id=SnwGrzYElOwk&format=png&color=000000"
                            alt="CV"
                            width="24"
                            height="24"
                            className="me-2"
                        />
                        CV
                    </a>
                    <a
                        href="https://github.com/annaandmandy/Skill_demonstration"
                        className="text-black text-decoration-none"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                            alt="GitHub"
                            width="24"
                            height="24"
                            className="me-2"
                        />
                        GitHub
                    </a>
                    <a
                        href="https://www.linkedin.com/in/hsiangyuhuang/"
                        className="text-black text-decoration-none"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
                            alt="LinkedIn"
                            width="24"
                            height="24"
                            className="me-2"
                        />
                        LinkedIn
                    </a>
                </p>
            </div>
        </footer>
    );
}