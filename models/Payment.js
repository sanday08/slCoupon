const mongoose = require("mongoose");
const { istdate } = require("../server");

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
        default: new Date(istdate).getHours().toString() + " : " + new Date(istdate).getMinutes().toString() + " : " + new Date(istdate).getSeconds().toString(),
    },
    DrDate: {
        type: String,
        default: new Date(istdate).getFullYear().toString() + "-" + (new Date(istdate).getMonth() + 1).toString() + "-" + new Date(istdate).getDate().toString(),
    },
    createDate: {
        type: Date,
        default: istdate,
    }
}, { timestamps: true })

module.exports = mongoose.model("Payment", PaymentSchema);