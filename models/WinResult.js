const mongoose = require("mongoose");


//Set you offset here like +5.5 for IST
var offsetIST = 19800000;

//Create a new date from the Given string
var d = new Date();

//To convert to UTC datetime by subtracting the current Timezone offset
var utcdate = new Date(d.getTime());

//Then cinver the UTS date to the required time zone offset like back to 5.5 for IST
var istdate = new Date(utcdate.getTime() + offsetIST)


const WinResultSchema = new mongoose.Schema({

    A: String,
    B: String,
    C: String,
    D: String,
    E: String,
    F: String,
    G: String,
    H: String,
    I: String,
    J: String,
    seriesNo: {
        type: Number,
        enum: [1, 3, 5, 6],
    },
    DrTime: {
        type: String,
        default: istdate.getHours().toString() + " : " + istdate.getMinutes().toString() + " : " + istdate.getSeconds().toString(),
    },
    DrDate: {
        type: String,
        default: istdate.getFullYear().toString() + "-" + (istdate.getMonth() + 1).toString() + "-" + istdate.getDate().toString(),
    },
    createDate: {
        type: Date,
        default: istdate,
    }
}, { timestamps: true })

module.exports = mongoose.model("WinResult", WinResultSchema);