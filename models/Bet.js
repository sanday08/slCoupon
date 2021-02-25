const mongoose = require("mongoose");

const BetSchema= new mongoose.Schema({
    retailerId:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    ticketId:{
        type:String,
        required: true,
    },
    betPoint:Number,
    won:{
        type:Number,
        default:0
    },

    claim:{
        type:Boolean,
        default:false,
    },
    SeriesNo:{
        type:Number,
        enum:[1,3,5,6],
        required: true
    },
    winPositions:[Number],
    ticketBets:{
        type:Object,
        required: true
    }

},{timeStamps: true})

module.exports = mongoose.model("Bet", BetSchema);   

