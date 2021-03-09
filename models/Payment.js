const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    toId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    fromId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    creditPoint: {
        type: Number,
        required: true,
    },
    macAddress: {
        type: String,
        required: [true, "Your System is not Verified"]
    },
    status: {
        type: String,
        default: "Pending"
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

module.exports = mongoose.model("Payment", PaymentSchema);