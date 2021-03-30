const mongoose = require("mongoose");

const VersionSchema = new mongoose.Schema({
    version: {
        type: Number,
        default: 1
    }

}, { timestamps: true })
module.exports = mongoose.model("Version", VersionSchema);