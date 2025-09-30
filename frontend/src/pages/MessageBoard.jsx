import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function MessageBoard() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        const { data, error } = await supabase
        .from("Message")
        .select("*")
        .order("likes", { ascending: false });
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

        if (!name || !content) return;

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

    const getColor = (likes) => {
        if (likes === 0) return "bg-gray-300 text-black";
        if (likes < 10) return "bg-blue-300 text-black";
        if (likes < 50) return "bg-pink-400 text-black";
        return "bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 text-black";
    };

    return (
        <div className="container-fluid py-3" style={{ backgroundColor: "#fffceb"}}>
            {/* Heading */}
            <div className="text-center mb-5">
                <h1 className="fw-bold">Message Board</h1>
            </div>

            {/* Floating messages container */}
            <div className="relative w-full border rounded-md mb-5" style={{ maxWidth: "800px", margin: "0 auto", maxHeight: "800px", overflowY: "auto" }}>
                {messages.map((m, i) => (
                <div
                    key={m.id}
                    className={`absolute px-4 py-2 rounded-full shadow-md cursor-pointer ${getColor(m.likes)}`}
                    onClick={() => handleLike(m.id, m.likes)}
                >
                    {m.content} 
                    <span className="ml-2 px-5">♡{m.likes}</span>
                </div>
                ))}
            </div>

            {/* Form */}
            <div className="d-flex flex-column align-items-center mb-5">
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
