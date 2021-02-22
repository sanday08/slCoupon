const mongoose = require("mongoose");

const WinningSchema= new mongoose.Schema({
    percent: {
        type:Number,
        default:0
    }
    
},{timeStamps: true})
module.exports = mongoose.model("Winning", WinningSchema);