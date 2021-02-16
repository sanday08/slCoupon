const asyncHandler = require("../middleware/async");
const ErrorRespose = require("../utils/errorResponse");
const User = require("../models/User");

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
  const user = await User.findById(req.params.id);
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
      else if(req.body.role==="retailers")
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
  await User.findOneAndDelete(req.params.id);
  res.status(200).json({ success: true, data: {} });
});


//@desc      Get all SuperDistributers
//@routes    GET /api/users/superdistributers
//Access     Private/Admin
exports.getSuperDistributers = asyncHandler(async (req, res, next) => {
 let users= await User.find({role:'superDisributer'})
  res.status(200).json({ success: true, data: users});
});


//@desc      Get all Distributers via superDisributer
//@routes    GET /api/users/distributer/:id
//Access     Private/Admin
exports.getDistributers = asyncHandler(async (req, res, next) => {
  await User.find({$AND:[{role:'disributer'},{referralId:req.params.id}]})
  res.status(200).json(res.advancedResults);
});

//@desc      Get all retailer via Disributer
//@routes    GET /api/users/retailer/:id
//Access     Private/Admin
exports.getRetailers = asyncHandler(async (req, res, next) => {
  await User.find({$AND:[{role:'retailer'},{referralId:req.params.id}]})
  res.status(200).json(res.advancedResults);
});


