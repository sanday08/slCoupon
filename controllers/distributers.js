const asyncHandler = require("../middleware/async");
const ErrorRespose = require("../utils/errorResponse");
const User = require("../models/User");


//@desc      Get all retailer via Disributer
//@routes    GET /api/distributer/retailer/:id
//Access     Private/Admin
exports.getRetailers = asyncHandler(async (req, res, next) => { 
  const users=await User.find({$and:[{role:'retailer'},{referralId:req.user.id}]})
  res.status(200).json({ success: true, data: users});
});

//@desc      Get all retailer via Disributer
//@routes    GET /api/users/addCreditPoint
//Access     Private/Distributer
exports.addRetailerCreditPoint = asyncHandler(async (req, res, next) => {
  if(req.body.creditPoint===0 || req.body.creditPoint===undefined )
  {
    return next(
      new ErrorResponse(
        `Please Add Credit Point And Credit Point should not be 0`,
        404
      )
    );
  }
  const retailers=await User.find({$and:[{role:'retailer'},{referralId:req.user.id}]})
  if(retailers.length===1)
  {
    const user=await User.findByIdAndUpdate(req.body.id,{$inc:{creditPoint:req.body.creditPoint}})
    res.status(200).json({ success: true, data: user});
  }
  else 
  {
    return next(
      new ErrorResponse(
        `You are not Authorized to Add Credit to this User..`,
        401
      )
    );
  }  
});