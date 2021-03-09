const mongoose = require("mongoose");


const WinnerIdSchema = new mongoose.Schema({
    referralId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    percent: {
        type: Number,
        default: 0
    },
    DrTime: {
        type: String,
        default: () => new Date().getHours().toString() + " : " + new Date().getMinutes().toString() + " : " + new Date().getSeconds().toString()
    },
    DrDate: {
        type: String,
        default: () => new Date().getFullYear().toString() + "-" + (new Date().getMonth() + 1).toString() + "-" + new Date().getDate().toString(),
    },
    createDate: {
        type: Date,
        default: () => new Date(),
    }

}, { timestamps: true })
module.exports = mongoose.model("WinnerId", WinnerIdSchema);