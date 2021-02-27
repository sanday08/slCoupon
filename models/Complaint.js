const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
    Complaint: {
        type: String,
        default: ""
    }

}, { timestamps: true })
module.exports = mongoose.model("Complaint", ComplaintSchema);