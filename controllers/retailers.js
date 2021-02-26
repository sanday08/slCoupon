const asyncHandler = require("../middleware/async");
const ErrorRespose = require("../utils/errorResponse");
const User = require("../models/User");
const WinResult = require("../models/WinResult");

//@desc      Get all retailer
//@routes    GET /api/retailer/winResultByDate
//Access     Private/Admin
exports.getWinnerResultsByDate = asyncHandler(async (req, res, next) => {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    console.log(req.query.date, req.body.date, req.param.date)
    const users = await WinResult.find({ DrDate: req.param.date });
    res.status(200).json({ success: true, data: users });
});