import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import "./Teri.css";

const CONTACT = "anna@hsiangyuhuang.com";

export default function TeriPrivacy() {
    return (
        <div className="container section teri-doc">
            <SEO
                title="Teri Privacy Policy"
                description="How the Teri app collects, uses and deletes your information."
                name="Hsiang Yu Huang"
                type="article"
            />
            <h1>Teri Privacy Policy</h1>
            <p className="teri-doc-meta">Effective October 16, 2026</p>

            <p>
                Teri is an app for two people who share one small black cat. It is made by Hsiang Yu Huang,
                an independent developer (“we”). This policy explains what Teri collects, why, who can see it,
                and how to delete it. Questions: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
            </p>

            <h2>The short version</h2>
            <ul>
                <li>What you add is shared only with your partner in Teri.</li>
                <li>We do not sell your data, show ads, or use third-party analytics or tracking.</li>
                <li>Location is used only when you tap “Use My Current Location”. There is no background tracking.</li>
                <li>You can delete your account in the app at any time: Settings › Delete account.</li>
            </ul>

            <h2>What Teri collects</h2>
            <ul>
                <li><strong>Account:</strong> your email address, the name you choose, and your birthday as month and day if you add it (never the year).</li>
                <li><strong>What you share:</strong> Moments, with their photos, notes, time, and the place you pick (place name and coordinates); calendar dates, wishes and reminders.</li>
                <li><strong>Wellness:</strong> weight and meal logs, meal photos and calorie values, if you use that tab.</li>
                <li><strong>Hearts:</strong> the hearts you send, and short voice clips recorded on Apple Watch.</li>
                <li><strong>Discord, only if you link it:</strong> your Discord user ID, and the messages and images posted in the channel you connect to Teri.</li>
                <li><strong>Device:</strong> a push notification token for your iPhone and Apple Watch.</li>
            </ul>

            <h2>How it is used</h2>
            <ul>
                <li>To run Teri for you and your partner: show what you shared, deliver hearts and reminders, and keep both phones in sync.</li>
                <li>
                    <strong>AI features.</strong> To fill in details you leave blank, Teri sends the photo and words of a Moment or meal
                    to an AI model, for example to estimate a meal’s calories. In a linked Discord channel, Teri reads messages
                    to notice plans, reminders and wishes, and to reply when you address it. This processing uses Anthropic’s Claude
                    models through Vercel AI Gateway. It is not used to build advertising profiles.
                </li>
                <li>Teri never fills in what it does not know; values you entered are not overwritten by AI.</li>
            </ul>

            <h2>Who can see it</h2>
            <p>
                Your partner in Teri can see what you share together, including Wellness entries. Nobody else can.
                We access data only to keep the service running, fix problems you report, or when the law requires it.
            </p>

            <h2>Service providers</h2>
            <ul>
                <li><strong>Supabase:</strong> database, sign-in, and private photo and voice storage.</li>
                <li><strong>Railway:</strong> hosts Teri’s server.</li>
                <li><strong>Vercel AI Gateway and Anthropic:</strong> process photos and text for the AI features above.</li>
                <li><strong>Apple:</strong> push notifications, Maps place search, and weather.</li>
                <li><strong>Discord:</strong> only if you link a channel.</li>
            </ul>
            <p>Each provider handles the data only to provide its service to Teri.</p>

            <h2>How long it is kept</h2>
            <ul>
                <li>Your information is kept while your account exists.</li>
                <li>A voice clip is deleted 24 hours after the heart is opened.</li>
                <li>A note Teri brings you fades after 7 days if nobody answers it.</li>
            </ul>

            <h2>Deleting your account</h2>
            <p>
                In Teri, open Settings › Delete account. This deletes your sign-in, name and birthday, your Wellness logs,
                the Moments you shared and their photos, hearts and voice clips between you, what you said in chats Teri heard,
                your Discord link, and Teri’s notes about the two of you. Your partner keeps what they created and your shared
                calendar, wishlist and their reminders, without your name. If your partner has already left, everything in
                your shared space is deleted. You can also email <a href={`mailto:${CONTACT}`}>{CONTACT}</a> to ask us to delete it.
            </p>

            <h2>Your choices</h2>
            <ul>
                <li>You can view, edit and delete what you added in the app.</li>
                <li>Camera, photos, location and microphone are used only after you allow them, and can be turned off in iOS Settings.</li>
                <li>You can unlink Discord in Settings at any time.</li>
            </ul>

            <h2>Children</h2>
            <p>Teri is not intended for children under 13, and we do not knowingly collect their information.</p>

            <h2>Security</h2>
            <p>Data is encrypted in transit. Photos and voice clips are stored privately and shared only through short-lived links.</p>

            <h2>Changes</h2>
            <p>If this policy changes, we will update this page and its effective date.</p>

            <p className="teri-doc-meta">
                <Link to="/Teri/support">Teri support</Link>
            </p>
        </div>
    );
}
