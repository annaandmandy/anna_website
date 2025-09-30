export default function GorillaCharms() {
    return (
       <div className="container-fluid py-3" style={{ backgroundColor: "#fffceb" }}>
            <h1 className="text-center mb-4">Iteration: Gorilla Charm</h1>
            <div className="row justify-content-center mb-5">
                <div className="col-md-6 text-center">
                <img
                    src="img/iteration_gorilla.jpg"
                    className="img-fluid"
                    alt="Iteration Gorilla"
                    style={{ maxWidth: "300px", height: "auto" }}
                />
                </div>
            </div>

            <h1 className="text-center mb-4">Story Telling</h1>
            <div className="row g-4 justify-content-center">
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
                <div key={imgName} className="col-12 col-md-6 col-lg-3 text-center" style={{ marginBottom: "20px"
            }}>
                    <img
                    src={`img/${imgName}.jpg`}
                    className="img-fluid"
                    alt={imgName.replace("_", " ")}
                    style={{ maxWidth: "300px", height: "auto" }}
                    />
                </div>
                ))}
            </div>
        </div>

    );
}