const mongoose = require("mongoose");

const MoodSchema = new mongoose.Schema({
    mood: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Mood", MoodSchema);
