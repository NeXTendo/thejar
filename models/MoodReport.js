const mongoose = require("mongoose");

const MoodReportSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    moodSummary: { type: String, required: true }
});

module.exports = mongoose.model("MoodReport", MoodReportSchema);
