const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  req.authorization = req.headers['authorization']
  console.log("*********************",req.authorization);
  if (req.authorization && req.authorization.startsWith("Bearer")) {
    //Set token from Bearer token in header
    token = req.authorization.split(" ")[1];
  }
  // //Set token from cookies
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  //Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }

  //Verify Token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }
});

//Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log("sandip")
      next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
