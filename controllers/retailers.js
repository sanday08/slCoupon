const asyncHandler = require("../middleware/async");
const ErrorRespose = require("../utils/errorResponse");
const User = require("../models/User");
const WinResult = require("../models/WinResult");

//@desc      Get all retailer
//@routes    GET /api/retailer/winResultByDate
//Access     Private/Admin
exports.getWinnerResultsByDate = asyncHandler(async (req, res, next) => {

    console.log(req.query.date, req.body.date, req.params.date)
    const users = await WinResult.find({ DrDate: req.params.date });
    res.status(200).json({ success: true, count: users.length, data: users });
});