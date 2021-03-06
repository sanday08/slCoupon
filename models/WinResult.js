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
        default: new Date(istdate).getHours().toString() + " : " + new Date(istdate).getMinutes().toString() + " : " + new Date(istdate).getSeconds().toString(),
    },
    DrDate: {
        type: String,
        default: new Date(istdate).getFullYear().toString() + "-" + (new Date(istdate).getMonth() + 1).toString() + "-" + new Date(istdate).getDate().toString(),
    },
    createDate: {
        type: Date,
        default: new Date(istdate),
    }
}, { timestamps: true })

module.exports = mongoose.model("WinResult", WinResultSchema);