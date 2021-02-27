const mongoose = require("mongoose");

const BetSchema = new mongoose.Schema({
    retailerId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    ticketId: {
        type: String,
        required: true,
    },
    betPoint: Number,
    won: {
        type: Number,
        default: 0
    },
    startPoint: Number,
    userName: String,
    name: String,
    claim: {
        type: Boolean,
        default: false,
    },

    seriesNo: {
        type: Number,
        enum: [1, 3, 5, 6],
        required: true
    },
    winPositions: {
        type: Array,
        default: []
    },
    ticketBets: {
        type: Object,
        required: true
    }

}, { timestamps: true })

module.exports = mongoose.model("Bet", BetSchema);

