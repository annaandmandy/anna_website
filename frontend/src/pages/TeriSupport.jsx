import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import "./Teri.css";

const CONTACT = "anna@hsiangyuhuang.com";

export default function TeriSupport() {
    return (
        <div className="container section teri-doc">
            <SEO
                title="Teri Support"
                description="Help with the Teri app: pairing, hearts, Discord and deleting your account."
                name="Hsiang Yu Huang"
                type="article"
            />
            <h1>Teri Support</h1>
            <p>
                Teri is a small black cat the two of you raise together: send love, share Moments and meals,
                and keep your plans in one place. If something is not working, email{" "}
                <a href={`mailto:${CONTACT}`}>{CONTACT}</a> and include your iPhone model and what you tapped.
            </p>

            <h2>Pairing with your partner</h2>
            <p>
                Sign in with your email, then tap “Create an invitation” and send the code to your partner.
                They sign in and paste it to join. The code works for seven days.
            </p>

            <h2>Hearts and notifications</h2>
            <p>
                Hearts wait on Teri’s stage until your partner taps them, even if notifications are off.
                To get alerts, allow notifications for Teri in iOS Settings.
            </p>

            <h2>Discord</h2>
            <p>
                In Settings, issue a link code and run <code>/link</code> in your shared channel, then a personal
                code with <code>/identify</code>. You can disconnect either one from Settings.
            </p>

            <h2>Deleting your account</h2>
            <p>
                Open Settings › Delete account. The screen lists what is deleted and what stays with your partner.
                See the <Link to="/Teri/privacy">privacy policy</Link> for details.
            </p>
        </div>
    );
}
