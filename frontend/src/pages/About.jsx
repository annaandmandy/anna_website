import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function About() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="container section">
      {/* Hero Section */}
      <div className="text-center" style={{ marginBottom: "3rem", marginTop: "3rem" }} data-aos="fade-down">
        <h1>About Me</h1>
      </div>

      <div className="grid grid-2" style={{ alignItems: "center", marginBottom: "4rem" }} data-aos="fade-up">
        <div>
          <h3 style={{ marginBottom: "1rem" }}>Short Bio</h3>
          <p>
            Hello! My name is Hsiang Yu Huang, but you can just call me <strong>Anna</strong>!
            Originally from <strong>Taiwan</strong>, I moved to the U.S. to pursue my Master's degree at Boston University.
            Outside of work, I am a huge dog lover—I have a lovely poodle back home in Taiwan that I miss dearly!
          </p>
        </div>
      </div>

      {/* Activities Section */}
      <div className="text-center" style={{ marginBottom: "3rem" }} data-aos="fade-up">
        <h2>Activities and Interests</h2>
      </div>

      <div className="grid grid-3">
        {/* Walking */}
        <div className="grid-item" data-aos="fade-up">
          <img
            src="/img_main/pikmin_walk.png"
            alt="Pikmin Bloom walking game - Anna Huang's fitness activity tracker"
          />
          <h3>Walking</h3>
          <p style={{ marginBottom: "1rem" }}>
            I play Pikmin Bloom, which is a game that encourages walking. I
            am currently on a weekly challenge to walk 10K steps with 5
            people.
          </p>
          <a href="https://pikminbloom.com/" className="btn btn-outline" target="_blank" rel="noopener noreferrer">Pikmin Bloom</a>
        </div>

        {/* Drawing */}
        <div className="grid-item" data-aos="fade-up">
          <img
            src="/img_main/drawing_cat.jpg"
            alt="Digital art drawing by Anna Huang - cat illustration on iPad"
          />
          <h3>Drawing</h3>
          <p style={{ marginBottom: "1rem" }}>
            I enjoy drawing on my iPad about things around me. You will see
            more drawings on this website. ╰(*°▽°*)╯
          </p>
          <a href="https://www.instagram.com/eina.0__0/" className="btn btn-outline" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>

        {/* Gaming */}
        <div className="grid-item" data-aos="fade-up">
          <img
            src="/img_main/silksong.png"
            alt="Hollow Knight Silksong gameplay - Anna's gaming interest"
          />
          <h3>Playing Video Games</h3>
          <p style={{ marginBottom: "1rem" }}>
            Recently I've been playing Hollow Knight Silksong, and it is
            driving me crazy. Does anyone want to help me beat the Boss
            (；′⌒`) ?
          </p>
          <a href="https://hollowknightsilksong.com/" className="btn btn-outline" target="_blank" rel="noopener noreferrer">Silksong</a>
        </div>
      </div>
    </div>
  );
}
