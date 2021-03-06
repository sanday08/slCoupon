const mongoose = require("mongoose");
const { istdate } = require("../server");



const WinResultSchema = new mongoose.Schema({

    A: String,
    B: String,
    C: String,
    D: String,
    E: String,
    F: String,
    G: String,
    H: String,
    I: String,
    J: String,
    seriesNo: {
        type: Number,
        enum: [1, 3, 5, 6],
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
    }
}, { timestamps: true })

module.exports = mongoose.model("WinResult", WinResultSchema);