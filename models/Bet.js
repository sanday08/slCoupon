const mongoose = require("mongoose");
const { istdate } = require("../server");



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
        default: new Date(istdate).getHours().toString() + " : " + new Date(istdate).getMinutes().toString() + " : " + new Date(istdate).getSeconds().toString(),
    },
    DrDate: {
        type: String,
        default: new Date(istdate).getFullYear().toString() + "-" + (new Date(istdate).getMonth() + 1).toString() + "-" + new Date(istdate).getDate().toString(),
    },
    createDate: {
        type: Date,
        default: istdate,
    },
    preBet: {
        type: Boolean,
        default: false,
    },
    preBetTime: String


}, { timestamps: true })

module.exports = mongoose.model("Bet", BetSchema);

