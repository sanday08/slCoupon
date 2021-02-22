const mongoose = require("mongoose");

const PaymentSchema= new mongoose.Schema({
    percent: {
        type:Number,
        default:0
    }
    
},{timeStamps: true})
module.exports = mongoose.model("Winning", PaymentSchema);