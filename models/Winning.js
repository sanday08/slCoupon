const mongoose = require("mongoose");

const PaymentSchema= new mongoose.Schema({
    percent: {
        type:String,
        default:0
    }
    
},{timeStamps: true})
module.exports = mongoose.model("Winning", PaymentSchema);