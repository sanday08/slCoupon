const mongoose = require("mongoose");
// const crypto = require("crypto");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please add an email"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add valid email",
    ],
  },
  referralId:{
    type:mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  mobile: {
    type: String,
    maxlength: [10, "Phone number can not be longer than 10 characters"],
  },
  role: {
    type: String,
    enum: ["retailer", "distributer","superDisributer",], //if you write admin than its display error "`admin` is not a valid enum value for path `role`".
    default: "retailer",
  },
  userName:{
    type: Number,
    required: [true, "Please add a userName"],
    unique: true,
    maxlength:[6,"UserName must be at least 6 characters"],
    minlength:[6,"UserName must be at least 6 characters"],
  },
  password: {
    type: Number,
    required: [true, "Please add a password"],
    minlength: [6,"Password must be at least 6 characters"],
    maxlength:[6,"password must be at least 6 characters"],
    select: false,
  },
  transactionPin:{
    type: Number,
    required: [true, "Please add a transactionPin"],
    minlength:[4,"TransactionPin must be at least 4 characters"],
    maxlength:[4,"TransactionPin must be at least 4 characters"]
  },

  address: String,
  pinCode: Number,
  isActive: {
    type: Boolean,
    default: true,
  },
  creditPoint:{
    type: Number,
    default:0
  },
  commissionPoint:{
    type:Number,
    default:0
  },
  commissionPercentage: {
    type: Number,
    default:0,
    maxlength:2
  },
  sharingPoint:{
    type: Number,
    default:0,
    maxlength:2
  },
  sharingPercentage: {
    type: Number,
    default:0
  },
 
  // resetPasswordToken: String,
  // resetPasswordExpire: Date, 

},{timeStamps: true});
//Encrypt password us bcrypt
// UserSchema.pre("save", async function () {
//   //this condition used when forgot password
//   if (!this.isModified("password")) {
//     next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

//Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// //Match user entered password and hash password in database
// UserSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// //Genrate and hash password token
// UserSchema.methods.getResetPasswordToken = function () {
//   //Genrate Token
//   const resetToken = crypto.randomBytes(20).toString("hex");

//   //Hask token and set to resetPasswordToken field
//   this.resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//   //Set expire
//   this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; //10 minutes
//   return resetToken;
// };
module.exports = mongoose.model("User", UserSchema);
