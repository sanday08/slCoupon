const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Payment=require("../models/Payment");
const User = require("../models/User");
const Winning = require("../models/Winning");



//@desc      Create users
//@routes    Post /api/users/updatePercentage
//Access     Private/Admin
exports.updateWinningPer = asyncHandler(async (req, res, next) => { 
  console.log("tere moh moh k dhage",req.body.percent);
  let user= await Winning.findByIdAndUpdate("602e55e9a494988def7acc25",{percent:req.body.percent});  

res.status(200).json({ success: true, data: user });
});


//@desc      Create users
//@routes    Get /api/users/getPercentage
//Access     Private/Admin
exports.getWinningPer = asyncHandler(async (req, res, next) => { 
  let user= await Winning.findById("602e55e9a494988def7acc25"); 
  res.status(200).json({ success: true, data: user });
  });
  





//@desc      Get all users
//@routes    GET /api/users
//Access     Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desc      Get Single users
//@routes    GET /api/users/:id
//Access     Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("+password");
  res.status(200).json({ success: true, data: user });
});

//@desc      Create users
//@routes    Post /api/users
//Access     Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => { 

      let userName=0;
      let lastUser=await User.findOne({role: req.body.role}).sort({userName:-1});
      if(lastUser)
        userName=lastUser.userName+1;
  console.log(userName);
    if(userName===0)
    {
      if(req.body.role==="admin")
        userName=10001;     
      else if(req.body.role==="superDistributer")
        userName=30001;     
      else if(req.body.role==="distributer")
        userName=50001;
      else if(req.body.role==="retailer")
        userName=70001;
    }
 console.log(userName)
  const user = await User.create({...req.body,userName});
  res.status(200).json({ success: true, data: user });
});

//@desc      Update users
//@routes    PUT /api/users/:id
//Access     Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: user });
});

//@desc      Delete users
//@routes    DELETE /api/users/:id
//Access     Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  console.log("userID is is",req.params.id);
  const user=await User.find({referralId:req.params.id});
  console.log("users=",user)
  if(user.length!=0){
    return next(
      new  ErrorResponse(
        `He have referal Users so first Delete his referal users...`,
        401
      )
    );
  }
  const data=await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, data: data });
});


//@desc      Get all SuperDistributers
//@routes    GET /api/users/superdistributers
//Access     Private/Admin
exports.getSuperDistributers = asyncHandler(async (req, res, next) => {
  console.log("Sandip Shiroya");
  const users= await User.find({role:'superDistributer'})
  res.status(200).json({ success: true, data: users});
});


//@desc      Get all Distributers via superDisributer
//@routes    GET /api/users/distributer
//Access     Private/Admin
exports.getDistributers = asyncHandler(async (req, res, next) => {
  console.log("Vijay lunde moklu**********************************************",req.body.id,req.params.id,req.query.id);
  const users=await User.find({$and:[{role:'distributer'},{referralId:req.query.id}]})
  res.status(200).json({ success: true, data: users});
});

//@desc      Get all retailer via Disributer
//@routes    GET /api/users/retailer
//Access     Private/Admin
exports.getRetailers = asyncHandler(async (req, res, next) => {
  const users=await User.find({$and:[{role:'retailer'},{referralId:req.query.id}]})
  res.status(200).json({ success: true, data: users});
});

//@desc      POST add Credit To Super Disributer
//@routes    POST /api/users/addCreditPoint
//Access     Private/Admin
exports.addSuperDistributerCreditPoint = asyncHandler(async (req, res, next) => {
  console.log("call addSuperDistributerCreditPoint")
  if(req.body.creditPoint<=0 || req.body.creditPoint===undefined )
  {
    return next(
      new ErrorResponse(
        `Please Add Credit Point And Credit Point should not be 0`,
        404
      )
    );
  }

  if(req.body.transactionPin!=req.user.transactionPin)
  {
    return next(
      new ErrorResponse(
        `Your Transaction PIn is Wrong.. `,
        401
      )
    );
  }

  const superDistributers=await User.find({$and:[{role:'superDistributer'},{referralId:req.user.id}]})
  console.log("#####################",superDistributers);
  if(superDistributers.length===1)
  {   
    await Payment.create({toId:req.body.id,fromId:req.user.id,creditPoint:req.body.creditPoint,macAddress:req.body.macAddress});
    const user=await User.findByIdAndUpdate(req.body.id,{$inc:{creditPoint:req.body.creditPoint}}) 
    res.status(200).json({ success: true, data: user});
  }
  else 
  {
    return next(
      new ErrorResponse(
        `You are not Authorized to Add Credit to this User `,
        401
      )
    );
  }  
});


//@desc      POST Reduce Credit To Super Disributer
//@routes    POST /api/users/reduceCreditPoint
//Access     Private/Admin
exports.reduceSuperDistributerCreditPoint = asyncHandler(async (req, res, next) => {
  if(req.body.creditPoint<=0 || req.body.creditPoint===undefined )
  {
    return next(
      new ErrorResponse(
        `Please Add Credit Point And Credit Point should not be 0`,
        404
      )
    );
  }

  if(req.body.transactionPin!=req.user.transactionPin)
  {
    return next(
      new ErrorResponse(
        `Your Transaction PIn is Wrong.. `,
        401
      )
    );
  }
  const superDistributers=await User.find({$and:[{role:'superDistributer'},{referralId:req.user.id}]})

  if(superDistributers.length===1)
  {
    if(superDistributers.creditPoint<req.body.creditPoint)
    {
      return next(
        new ErrorResponse(
          `Check Credit Point! Credit Point is insufficient..`,
          404
        )
      );
    }
    await Payment.create({toId:req.body.id,fromId:req.user.id,creditPoint:req.body.creditPoint,macAddress:req.body.macAddress});
    const user=await User.findByIdAndUpdate(req.body.id,{$inc:{creditPoint:-req.body.creditPoint}})
    res.status(200).json({ success: true, data: user});
  }
  else 
  {
    return next(
      new  ErrorResponse(
        `You are not Authorized to Add Credit to this User.`,
        401
      )
    );
  }  
});


//@desc      Get all Username
//@routes    GET /api/users/userName
//Access     Private/Admin
exports.getUserName = asyncHandler(async (req, res, next) => {
  const users=await User.find().select({username});
  res.status(200).json({ success: true, data: users});
});

//@desc      Get all Username
//@routes    GET /api/users/transactions
//Access     Private/Admin
exports.getTransactions = asyncHandler(async (req, res, next) => {
  const users=await Payment.find({$or:[{toId:req.user.id},{fromId:req.user.id}]});
  res.status(200).json({ success: true, data: users});
});


// //@desc      Get all userInfo via Username
// //@routes    GET /api/users/userName
// //Access     Private/Admin
// exports.getUsers = asyncHandler(async (req, res, next) => {
//   const users=await User.find({username: req.query.username});
//   res.status(200).json({ success: true, data: users});
// });