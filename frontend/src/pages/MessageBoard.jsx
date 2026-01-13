import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import AOS from "aos";
import "aos/dist/aos.css";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import SEO from "../components/SEO";

export default function MessageBoard() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from("Message")
            .select("*")
            .order("likes", { ascending: false })
            .order("created_at", { ascending: false });
        console.log(data);

        if (error) {
            console.error("Error fetching messages:", error);
        } else {
            setMessages(data);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const content = form.content.value;

        if (!content) return;

        const { error } = await supabase
            .from("Message")
            .insert([{ content, likes: 0, created_at: new Date() }]);

        if (!error) {
            fetchMessages();
            form.reset();
        }
    };

    const handleLike = async (id, currentLikes) => {
        await supabase.from("Message").update({ likes: currentLikes + 1 }).eq("id", id);
        fetchMessages();
    };

    // const getColor = (likes) => {
    //     if (likes === 0) return "bg-gray-300 text-black";
    //     if (likes < 10) return "bg-blue-300 text-black";
    //     if (likes < 50) return "bg-pink-400 text-black";
    //     return "bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 text-black";
    // };

    return (
        <div className="container-fluid py-3">
            <SEO
                title="Message Board - Hsiang Yu (Anna) Huang"
                description="Community message board. Leave a note, share a thought, or just say hi!"
                name="Hsiang Yu Huang"
                type="website"
            />
            {/* Heading */}
            <div className="text-center mb-5" data-aos="fade-down">
                <h1 className="fw-bold">Message Board</h1>
                <p>Leave Me A Message, And Click to Add Likes!</p>
            </div>

            {/* Floating messages container */}
            <div className="position-relative w-100 rounded mb-5" style={{ maxWidth: "800px", margin: "0 auto", maxHeight: "500px", overflowY: "auto" }} data-aos="fade-up">
                {messages.map((m, i) => (
                    <div
                        key={m.id}
                        className={`d-flex justify-content-between align-items-center mb-3 p-3 rounded shadow-sm cursor-pointer`}
                        style={{
                            background: "linear-gradient(135deg, #ffecd2, #fffbea)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                        onClick={() => handleLike(m.id, m.likes)}
                    >
                        <span>{m.content}  &nbsp; ♡  {m.likes}</span>
                        <span className="text-muted" style={{ fontSize: "0.8rem" }}> - {new Date(m.created_at).toLocaleString()}</span>
                    </div>
                ))}
            </div>

            {/* Form */}
            <div className="d-flex flex-column align-items-center mb-5" data-aos="fade-up">
                <form
                    onSubmit={handleSubmit}
                    className="w-full"
                    style={{ maxWidth: "800px", width: "90%" }}
                >
                    <div className="mb-3">
                        <label htmlFor="content" className="form-label">
                            Message:
                        </label>
                        <input
                            type="text"
                            id="content"
                            name="content"
                            className="form-control"
                            placeholder="Write a message..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn w-100"
                        style={{ backgroundColor: "#FFD93D" }}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
