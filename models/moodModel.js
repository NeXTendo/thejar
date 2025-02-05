const mongoose = require("mongoose");

const MoodSchema = new mongoose.Schema({
    mood: Number,
    timestamp: { type: Date, default: Date.now },
    encouragementMessage: String
});

module.exports = mongoose.model("Mood", MoodSchema);
