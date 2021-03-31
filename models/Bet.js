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
    retailerCommission: {
        type: Number,
        default: 0
    },
    distributerCommission: {
        type: Number,
        default: 0
    },
    superDistributerCommission: {
        type: Number,
        default: 0
    },
    cTime: {
        type: String,
        default: () => new Date().getHours().toString() + " : " + new Date().getMinutes().toString()
    },
    DrTime: String,
    DrDate: {
        type: String,
        default: () => new Date().getFullYear().toString() + "-" + (new Date().getMonth() + 1).toString() + "-" + new Date().getDate().toString(),
    },
    createDate: {
        type: Date,
        default: () => new Date(),
    },
    isAdvance:
    {
        type: Boolean,
        default: false,
    },
    isCount:
    {
        type: Boolean,
        default: true,
    }

}, { timestamps: true })

module.exports = mongoose.model("Bet", BetSchema);

