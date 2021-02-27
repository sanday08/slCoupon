const mongoose = require("mongoose");

const AnnouncementSchema= new mongoose.Schema({
    announcement: {
        type:String,
        default:""
    }
    
},{timeStamps: true})
module.exports = mongoose.model("Announcement", AnnouncementSchema);