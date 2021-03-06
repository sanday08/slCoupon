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
    },
    DrTime: {
        type: String,
        default: new Date(new Date().getTime() + 19800000).getHours().toString() + " : " + new Date(new Date().getTime() + 19800000).getMinutes().toString() + " : " + new Date(new Date().getTime() + 19800000).getSeconds().toString(),
    },
    DrDate: {
        type: String,
        default: new Date(new Date().getTime() + 19800000).getFullYear().toString() + "-" + (new Date(new Date().getTime() + 19800000).getMonth() + 1).toString() + "-" + new Date(new Date().getTime() + 19800000).getDate().toString(),
    },
    createDate: {
        type: Date,
        default: new Date(new Date().getTime() + 19800000),
    },
    preBet: {
        type: Boolean,
        default: false,
    },
    preBetTime: String


}, { timestamps: true })

module.exports = mongoose.model("Bet", BetSchema);

