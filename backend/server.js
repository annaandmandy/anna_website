const express = require('express');
const app = express();
const port = 3000;
const Groq = require("groq-sdk");

app.listen(port, () =>{
    console.log(`Server runing at  http://localhost:${port}`);
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

app.post("/api/generate", async (req, res) => {
    try{
        const { project } = req.body;
        const response = await groq.chat.completions.create({
            messages: [{ role: "user", content: `Give a short and simple description for ${project}.` }],
            model: "llama-3.3-70b-versatile",
        });
        res.json({ description: response.choices[0]?.message?.content || "No description available." });
    } catch (error) {
        console.error("Error generating description:", error);
        res.status(500).json({ error: "Failed to generate description" });
    }
});