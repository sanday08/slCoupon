const asyncHandler = require("../middleware/async");
const ErrorRespose = require("../utils/errorResponse");
const User = require("../models/User");
const WinResult = require("../models/WinResult");

//@desc      Get all retailer
//@routes    GET /api/retailer/winResult
//Access     Private/Admin
exports.getWinnerResults = asyncHandler(async (req, res, next) => {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const users = await WinResult.find({ created_on: { $gte: startOfToday } });
    res.status(200).json({ success: true, data: users });
});