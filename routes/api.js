const express = require("express");
const router = express.Router();
const axios = require("axios");
const Mood = require("./models/Mood");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
    console.error("❌ Error: OpenAI API key is missing!");
    process.exit(1);
}
// **AI Response Endpoint**
router.post("/generate-response", async (req, res) => {
    try {
        const { message } = req.body;

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You are a loving and comforting boyfriend." },
                    { role: "user", content: message }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error("❌ Error generating AI response:", error);
        res.status(500).json({ error: "Failed to get AI response." });
    }
});

// **Save Mood to MongoDB**
router.post("/save-mood", async (req, res) => {
    try {
        const newMood = new Mood(req.body);
        await newMood.save();
        res.status(201).json({ message: "🌿 Mood saved successfully!" });
    } catch (error) {
        console.error("❌ Error saving mood:", error);
        res.status(500).json({ error: "Failed to save mood." });
    }
});
// **Get Mood Summary**
router.get("/get-mood-summary", async (req, res) => {
    try {
        const moods = await Mood.find();
        if (!moods.length) return res.json({ summary: "No mood data yet!" });

        const avgMood = moods.reduce((acc, m) => acc + m.mood, 0) / moods.length;
        let moodText = "Neutral 😊";

        if (avgMood < 2) moodText = "Not Feeling Great 😞";
        else if (avgMood < 3) moodText = "Could Be Better 😐";
        else if (avgMood > 4) moodText = "Feeling Happy! 😄";

        res.json({ summary: `Your average mood is: ${moodText}` });
    } catch (error) {
        console.error("❌ Error fetching mood summary:", error);
        res.status(500).json({ error: "Failed to retrieve mood summary." });
    }
});
module.exports = router;
