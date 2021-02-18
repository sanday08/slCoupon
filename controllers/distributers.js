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

//@desc      POST add Credit To Retailer
//@routes    POST /api/distributers/addCreditPoint
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
  const retailers=await User.find({$and:[{role:'retailer'},{referralId:req.user.id},{transactionPin:req.body.transactionPin}]})
  const distributer= await User.findById(req.user.id);
  if(distributer.creditPoint < req.body.creditPoint)
  {
    return next(
      new ErrorResponse(
        `Check Credit Point! Credit Point is insufficient..`,
        404
      )
    );
  }
  if(retailers.length===1)
  {
    await Payment.create({toid:req.body.id,fromId:req.user.id,creditPoint:req.body.creditPoint,macAddress:req.body.macAddress});
    const user=await User.findByIdAndUpdate(req.body.id,{$inc:{creditPoint:req.body.creditPoint}})
    res.status(200).json({ success: true, data: user});
  }
  else 
  {
    return next(
      new ErrorResponse(
        `You are not Authorized to Add Credit to this User or May be your Transaction PIn is Wrong..`,
        401
      )
    );
  }  
});



//@desc      POST Reduce Credit To retailer
//@routes    POST /api/distributers/reduceCreditPoint
//Access     Private/Admin
exports.reduceRetailerCreditPoint = asyncHandler(async (req, res, next) => {
  if(req.body.creditPoint>0 || req.body.creditPoint===undefined )
  {
    return next(
      new ErrorResponse(
        `Please Add Credit Point And Credit Point should not be 0`,
        404
      )
    );
  }
  const retailers=await User.find({$and:[{role:'retailers'},{referralId:req.user.id},{transactionPin:req.body.transactionPin}]})
  
  if(retailers.length===1)
  {
    if(retailers.creditPoint<req.body.creditPoint)
    {
      return next(
        new ErrorResponse(
          `Check Your Credit Point! Credit Point is insufficient..`,
          404
        )
      );
    }
    await Payment.create({toid:req.body.id,fromId:req.user.id,creditPoint:req.body.creditPoint,macAddress:req.body.macAddress});
    const user=await User.findByIdAndUpdate(req.body.id,{$inc:{creditPoint:req.body.creditPoint}})
    res.status(200).json({ success: true, data: user});
  }
  else 
  {
    return next(
      new ErrorResponse(
        `You are not Authorized to Add Credit to this User or May be your Transaction PIn is Wrong..`,
        401
      )
    );
  }  
});

