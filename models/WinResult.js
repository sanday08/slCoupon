const mongoose = require("mongoose");

const WinResultSchema= new mongoose.Schema({
  
   A:String,
   B:String,
   C:String,
   D:String,
   E:String,
   F:String,
   G:String,   
   H:String,
   I:String,
   J:String,
   SeriesNo:{
       type:Number,
       enum:[1,3,5,6],
   },
   DrTime:{
       type:String,
       default:new Date().getHours().toString()+" : "+new Date().getMinutes().toString()+" : "+new Date().getSeconds().toString(),
   },
   DrDate:{
    type:String,
    default:new Date().getFullYear().toString()+" : "+(new Date().getMonth()+1).toString()+" : "+new Date().getDate().toString(),
}
},{timeStamps: true})

module.exports = mongoose.model("WinResult", WinResultSchema);