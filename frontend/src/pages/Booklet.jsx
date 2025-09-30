import React, { useEffect } from 'react';
import AOS from "aos";
import "aos/dist/aos.css";


export default function Booklet() {
    useEffect(() => {
        AOS.init({ duration: 1000 });
      }, []);
    
    return (
        <div className="container-fluid py-3" style={{ backgroundColor: "#fffceb" }}>
            <div className="mb-2 px-4 text-center" data-aos="fade-down">
                <h1 className="fw-bold">Booklet</h1>
                <p>Final Project from AR123 Foundation Design.</p>
            </div>

            <div style={{position:"relative", paddingTop:"0", width:"auto", height:"700px"}}>
                <iframe style={{position:"absolute", border:"none", width:"80%", height:"100%", left:"10%", top:"0"}} src="https://online.fliphtml5.com/mypage/sgvq/"  seamless="seamless" scrolling="no" frameborder="0" allowtransparency="true" allowfullscreen="true" >
                </iframe>
            </div>
        </div>
    );
};