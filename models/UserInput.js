const mongoose = require("mongoose");

const UserInputSchema = new mongoose.Schema({
    message: { type: String, required: true },
    reply: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("UserInput", UserInputSchema);
