const mongoose = require("mongoose");


const ComplaintSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ""
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
module.exports = mongoose.model("Complaint", ComplaintSchema);