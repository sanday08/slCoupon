const asyncHandler = require("../middleware/async");
const ErrorRespose = require("../utils/errorResponse");
const User = require("../models/User");
const WinResult = require("../models/WinResult");
const Bet = require("../models/Bet");




//@desc      Get all Bet History
//@routes    GET /api/retailers/betHistroy
//Access     Private/Admin
exports.getAllBetHistroy = asyncHandler(async (req, res, next) => {


    const bets = await Bet.find().sort("-createdAt");
    res.status(200).json({ success: true, count: bets.length, data: bets });
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





//@desc      Get all Win Result History
//@routes    GET /api/retailers/winResultByDate
//Access     Private/Admin
exports.getWinnerResultsByDate = asyncHandler(async (req, res, next) => {

    console.log(req.query.date, req.body.date, req.params.date)
    const winnerHistory = await WinResult.find({ DrDate: req.params.date });
    res.status(200).json({ success: true, count: winnerHistory.length, data: winnerHistory });
});

//@desc      Claime Ticket
//@routes    Put /api/retailers/claim
//Access     Private/Admin
exports.claimeTicket = asyncHandler(async (req, res, next) => {

    console.log("req.body.ticketId", req.body.ticketId, req.query.ticketId, req.params.ticketId);
    bets = await Bet.find({ ticketId: req.body.ticketId });
    console.log("This is bets", bets)
    let result = "Ticket Id Not Found";
    if (bets) {
        if (bets.retailerId === req.user.id) {
            if (bets.winPositions == [])
                result = "Result Not yet Declared";
            else if (bets.claim) {
                result = "Ticket Already Claimed."
            }
            else {
                await Bet.findOneAndUpdate({ ticketId: req.body.ticketId }, { claim: true });
                if (bets.won != 0)
                    result = "You won the Ticket of " + bets.won
                else
                    result = "You loss The Ticket"
            }
        }
        else
            result = "You purchased your ticket from other retailer.."

    }

    res.status(200).json({ success: true, data: result });
});