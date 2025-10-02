import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Interests() {
    useEffect(() => {
        AOS.init({ duration: 1000 });
      }, []);

    return (
        <div className="container-fluid py-3 d-flex flex-column justify-content-center">
            <div className="px-4 text-center mb-2" data-aos="fade-down">
                <h1 className="fw-bold">Interests</h1>
            </div>
            <div className="mb-4 d-flex flex-column" data-aos="fade-up" style={{ maxWidth: "800px", margin: "0 auto" }}>
                <p className="mb-2">I am also interested in drawing and designing. Here are some of the works.</p>
                <ul>
                    <li className="nav-item" >
                        <a className="nav-link active" aria-current="page" href="/gorillacharms">
                            Gorilla Charms
                        </a>
                    </li>
                    <li className="nav-item" >
                        <a className="nav-link active" aria-current="page" href="/booklet">
                            Booklet
                        </a>
                    </li>
                    <li className="nav-item" >
                        <a className="nav-link active" aria-current="page" href="https://huanghybu.cargo.site/">
                            Collages
                        </a>
                    </li>
                </ul>
            </div>
            
        </div>
    );
}
//