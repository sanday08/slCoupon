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
        default: new Date(new Date(new Date(new Date().getTime()).getTime() + 19800000)).getHours().toString() + " : " + new Date(new Date(new Date(new Date().getTime()).getTime() + 19800000)).getMinutes().toString() + " : " + new Date(new Date(new Date(new Date().getTime()).getTime() + 19800000)).getSeconds().toString(),
    },
    DrDate: {
        type: String,
        default: new Date(new Date(new Date(new Date().getTime()).getTime() + 19800000)).getFullYear().toString() + "-" + (new Date(new Date(new Date(new Date().getTime()).getTime() + 19800000)).getMonth() + 1).toString() + "-" + new Date(new Date(new Date(new Date().getTime()).getTime() + 19800000)).getDate().toString(),
    },
    createDate: {
        type: Date,
        default: new Date(new Date(new Date(new Date().getTime()).getTime() + 19800000)),
    }
}, { timestamps: true })

module.exports = mongoose.model("WinResult", WinResultSchema);