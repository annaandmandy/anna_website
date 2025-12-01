import React from "react";

export default function GorillaCharms() {
    return (
        <div className="container section">
            <div className="text-center" style={{ marginBottom: "3rem" }}>
                <h1>Iteration: Gorilla Charm</h1>
            </div>
            <div className="flex justify-center" style={{ marginBottom: "4rem" }}>
                <img
                    src="img/iteration_gorilla.jpg"
                    alt="Iteration Gorilla"
                    style={{ maxWidth: "100%", maxHeight: "400px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                />
            </div>

            <div className="text-center" style={{ marginBottom: "3rem" }}>
                <h1>Story Telling</h1>
            </div>
            <div className="grid grid-3">
                {[
                    "ape_monkey",
                    "side",
                    "clip_guava",
                    "guava",
                    "tape_gorilla",
                    "furry",
                    "evolution",
                    "tarzan",
                    "holdhand",
                    "side_mouth",
                    "clip_banana",
                    "gorilla_rain",
                    "read",
                    "red_light",
                    "draw_child",
                    "russian_doll",
                    "watch_mount",
                    "rock_sitting",
                    "muscle",
                    "leader"
                ].map((imgName) => (
                    <div key={imgName} className="grid-item flex justify-center items-center">
                        <img
                            src={`img/${imgName}.jpg`}
                            alt={imgName.replace("_", " ")}
                            style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}