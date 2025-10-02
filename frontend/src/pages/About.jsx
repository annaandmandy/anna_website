import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function About() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="container-fluid py-3">
      {/* Hero Section */}
        <div className="mb-5 px-4 text-center" data-aos="fade-down">
            <h1 className="fw-bold mb-3">About Me</h1>
        </div>

       <div
            className="mx-auto my-5 p-4 d-flex flex-column flex-md-row align-items-center justify-content-between"
            style={{
                width: "90%",
                maxWidth: "700px",
                borderRadius: "15px",
                backgroundColor: "rgb(250, 247, 217)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                borderTop: "6px solid #FFD93D",
            }}
            data-aos="fade-up"
            >
            <div className="d-flex flex-column justify-content-center text-center text-md-start mb-3 mb-md-0 ms-md-5">
                <h3 className="mb-3">Short Bio</h3>
                <p className="mb-3">Hello! My name is Hsiang Yu Huang, and you can just call me Anna! I
                come from Taiwan, and came to the U.S. for my Master's Degree. I love
                dogs, and I had a poodle back in Taiwan.</p>
            </div>   
            <div>
                <img
                src="/img_main/anna-welcome.png"
                alt="Anna"
                style={{
                    width: "300px",
                    height: "auto",
                    objectFit: "cover",
                }}
                />
            </div>      
        </div>

      {/* Activities Section */}
      <div className="text-center" data-aos="fade-up">
          <h2 className="fw-bold text-center mb-4">Activities and Interests</h2>
      </div>
    
      <div className="row g-4 d-flex align-items-stretch justify-content-center" style={{ width: "90%", margin: "0 auto"  }}>
        {/* Walking */}
        <div className="col-md-6 col-lg-4" data-aos="fade-up">
          <div className="card h-100 shadow-sm" style={{backgroundColor: "rgb(250, 247, 217)", borderTop: "6px solid #FFD93D"}}>
            <img
              src="/img_main/pikmin_walk.png"
              className="card-img-top p-3"
              alt="Walking"
              style={{ height: "300px", objectFit: "contain" }}
            />
            <div className="card-body text-center">
              <h3 className="h5 fw-bold">Walking</h3>
              <p className="card-text">
                I play Pikmin Bloom, which is a game that encourages walking. I
                am currently on a weekly challenge to walk 10K steps with 5
                people.
              </p>
              <a
                href="https://pikminbloom.com/"
                className="btn btn-outline-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pikmin Bloom
              </a>
            </div>
          </div>
        </div>

        {/* Drawing */}
        <div className="col-md-6 col-lg-4" data-aos="fade-up">
          <div className="card h-100 shadow-sm"  style={{backgroundColor: "rgb(250, 247, 217)", borderTop: "6px solid #FFD93D"}}>
            <img
              src="/img_main/drawing_cat.jpg"
              className="card-img-top p-3"
              alt="Drawing"
              style={{ height: "300px", objectFit: "contain" }}
            />
            <div className="card-body text-center">
              <h3 className="h5 fw-bold">Drawing</h3>
              <p className="card-text">
                I enjoy drawing on my iPad about things around me. You will see
                more drawings on this website. ╰(*°▽°*)╯
              </p>
              <a
                href="https://www.instagram.com/eina.0__0/"
                className="btn btn-outline-danger"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Gaming */}
        <div className="col-md-6 col-lg-4" data-aos="fade-up">
          <div className="card h-100 shadow-sm"  style={{backgroundColor: "rgb(250, 247, 217)", borderTop: "6px solid #FFD93D"}}>
            <img
              src="/img_main/silksong.png"
              className="card-img-top p-3"
              alt="Gaming"
              style={{ height: "300px", objectFit: "contain" }}
            />
            <div className="card-body text-center">
              <h3 className="h5 fw-bold">Playing Video Games</h3>
              <p className="card-text">
                Recently I've been playing Hollow Knight Silksong, and it is
                driving me crazy. Does anyone want to help me beat the Boss
                (；′⌒`) ?
              </p>
              <a
                href="https://hollowknightsilksong.com/"
                className="btn btn-outline-success"
                target="_blank"
                rel="noopener noreferrer"
              >
                Silksong
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
