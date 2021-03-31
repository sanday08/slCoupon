const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const WinResult = require("../models/WinResult");
const Bet = require("../models/Bet");
const Complaint = require("../models/Complaint");
const mongoose = require("mongoose");
const Announcement = require("../models/Announcement");

//@desc      Post Add Advanced Bet
//@routes    Post /api/retailers/advancedBet
//Access     Private/Retailer



//@desc      Get 7Days Bet History
//@routes    GET /api/retailers/betHistroy
//Access     Private/Admin
exports.get7Days = asyncHandler(async (req, res, next) => {

    let result = await WinResult.find({
        createDate: {
            $gte: new Date(new Date(req.params.date) - 8 * 24 * 60 * 60 * 1000),
            $lte: new Date(req.params.date),
        }
    }).sort({ createdAt: -1 })

    return res.status(200).json({ success: true, count: result.length, data: result })
});




//@desc      Get Announcement
//@routes    Get /api/retailers/announcement
//Access     Private/Retailers
exports.getAnnouncement = asyncHandler(async (req, res, next) => {
    let announcement = await Announcement.findById("6039ea5b9ee94d505a90dd3e");
    res.status(200).json({ success: true, data: announcement.announcement });
});


//@desc      Get Current Draw Records
//@routes    Get /api/retailers/reprint/:drTime
//Access     Private/Retailers
exports.getReprintData = asyncHandler(async (req, res, next) => {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    console.log("Dr Time is: ", req.params.drTime);
    console.log("Start Date", startOfToday);
    let bets = await Bet.find({ DrTime: req.params.drTime });
    console.log("Data is", bets);
    res.status(200).json({ success: true, data: bets });
});








//@desc      Get 7Days Bet History
//@routes    GET /api/retailers/betHistroy
//Access     Private/Admin
exports.getBetHistroyReport = asyncHandler(async (req, res, next) => {
    console.log("date by Piyush", req.params, req.query, req.body);
    let result = await Bet.aggregate([
        {
            $match: {
                retailerId: mongoose.Types.ObjectId(req.user.id),
                createDate: {
                    $gte: new Date(req.query.dateStart),
                    $lte: new Date(req.query.dateEnd)
                }
            }
        },
        {
            $group: {
                _id: '$DrDate',
                totalBetPonts: {
                    $sum: '$betPoint'
                },
                totalWon: {
                    $sum: '$won'
                },
                commissionPoint: {
                    $sum: '$retailerCommission'
                }
            }
        }
    ]);//await Bet.aggregate().gr

    return res.status(200).json({ success: true, data: result })
});






//@desc      Get all Bet History
//@routes    GET /api/retailers/betHistroy
//Access     Private/Admin
exports.getAllBetHistroy = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});



//@desc      Get  Bet History via user
//@routes    GET /api/retailers/betHistroy/:retailerId
//Access     Private/Admin
exports.getBetHistroy = asyncHandler(async (req, res, next) => {

    console.log(req.query.retailerId, req.body.retailerId, req.params.retailerId)

    const bets = await Bet.find({ retailerId: req.params.retailerId });

    res.status(200).json({ success: true, count: bets.length, data: bets });
});



//@desc      Get all Online Retailer
//@routes    GET /api/retailers/online
//Access     Private/Admin
exports.getOnlineRetailers = asyncHandler(async (req, res, next) => {
    const users = await User.find({ isLogin: true });
    res.status(200).json({ success: true, count: users.length, data: users });
});




//@desc      Get Single Ticket Info via Ticket Id
//@routes    GET /api/retailers/ticket
//Access     Private/Admin
exports.getTicket = asyncHandler(async (req, res, next) => {
    const bets = await Bet.find({ ticketId: req.params.ticketId });
    res.status(200).json({ success: true, data: bets });
});





//@desc      Get all Win Result History
//@routes    GET /api/retailers/winResultByDate
//Access     Private/Admin
exports.getWinnerResultsByDate = asyncHandler(async (req, res, next) => {


    const winnerHistory = await WinResult.find({ DrDate: req.params.date });
    res.status(200).json({ success: true, count: winnerHistory.length, data: winnerHistory });
});

//@desc      Claime Ticket
//@routes    Put /api/retailers/claim
//Access     Private/Admin
exports.claimeTicket = asyncHandler(async (req, res, next) => {


    bets = await Bet.find({ ticketId: req.body.ticketId.toString().toUpperCase() });

    let result = "Ticket Id Not Found";
    if (bets.length != 0) {

        if (bets[0].retailerId == req.user.id) {
            if (bets[0].winPositions.length == 0)
                result = "Result Not yet Declared";
            else if (bets[0].claim) {
                result = "Ticket Already Claimed."
            }
            else {
                await Bet.findOneAndUpdate({ ticketId: req.body.ticketId }, { claim: true });
                if (bets[0].won != 0)
                    result = "You won the Ticket of " + bets[0].won
                else
                    result = "You loss The Ticket"
            }
        }
        else
            result = "You purchased your ticket from other retailer.."

    }

    res.status(200).json({ success: true, data: result });
});



//@desc      Post all Bet History
//@routes    Post /api/retailers/complaint
//Access     Private/Admin
exports.addComplaint = asyncHandler(async (req, res, next) => {
    const bets = await Complaint.create({ title: req.body.title, content: req.body.content, retailerId: req.user.id });
    res.status(200).json({ success: true, count: bets.length, data: bets });
});




//@desc      Get 7days Win Result History
//@routes    GET /api/retailers/winResultByDate
//Access     Private/Admin
exports.getWinnerResultsByDate = asyncHandler(async (req, res, next) => {

    console.log(req.query.date, req.body.date, req.params.date)
    const winnerHistory = await WinResult.find({ DrDate: req.params.date });
    res.status(200).json({ success: true, count: winnerHistory.length, data: winnerHistory });
});
