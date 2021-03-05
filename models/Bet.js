const mongoose = require("mongoose");


//Set you offset here like +5.5 for IST
var offsetIST = 19800000;

//Create a new date from the Given string
var d = new Date();

//To convert to UTC datetime by subtracting the current Timezone offset
var utcdate = new Date(d.getTime());

//Then cinver the UTS date to the required time zone offset like back to 5.5 for IST
var istdate = new Date(utcdate.getTime() + offsetIST)

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
        default: istdate.getHours().toString() + " : " + istdate.getMinutes().toString() + " : " + istdate.getSeconds().toString(),
    },
    DrDate: {
        type: String,
        default: istdate.getFullYear().toString() + "-" + (istdate.getMonth() + 1).toString() + "-" + istdate.getDate().toString(),
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

