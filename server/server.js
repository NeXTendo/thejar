require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const Mood = require("../models/Mood");
const connectDB = require("./db");
const apiRoutes = require("../routes/api");

const app = express();
app.use(express.json());

// CORS setup to allow multiple origins
app.use(cors({
    origin: [
        "http://localhost:3000",  // Existing allowed origin
        "http://127.0.0.1:5500"   // Add this one
    ]
}));

// Connect to MongoDB
connectDB();

// Set up API routes
app.use("/api", apiRoutes);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
console.log("OpenAI API Key: ", process.env.OPENAI_API_KEY);

// **AI Response Endpoint**
app.post("/generate-response", async (req, res) => {
    try {
        const { message } = req.body;

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                "model": "gpt-4",
                "messages": [
                  { "role": "system", "content": "You are a loving and comforting boyfriend." },
                  { "role": "user", "content": "Hello!" }
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
        console.error("Error generating response:", error);
        res.status(500).json({ error: "Failed to get AI response." });
    }
});

// **Save Mood to MongoDB**
app.post("/save-mood", async (req, res) => {
    try {
        const newMood = new Mood(req.body);
        await newMood.save();
        res.status(201).json({ message: "Mood saved successfully!" });
    } catch (error) {
        console.error("Error saving mood:", error);
        res.status(500).json({ error: "Failed to save mood." });
    }
});

// **Get Mood Summary**
app.get("/get-mood-summary", async (req, res) => {
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
        console.error("Error fetching mood summary:", error);
        res.status(500).json({ error: "Failed to retrieve mood summary." });
    }
});

// **Start Server**
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
