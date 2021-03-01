const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    contant: {
        type: String,
        default: ""
    }

}, { timestamps: true })
module.exports = mongoose.model("Complaint", ComplaintSchema);