const express = require("express");
const {
  register,
  login,
  logout,
  getMe,
  // forgotPassword,
  // resetPassword,
  updateDetails,
  updatePassword,
  updateTransactionPin,
  loginRetailer,
  getTransactions
} = require("../controllers/auth");
const { protect,authorize } = require("../middleware/auth");

const router = express.Router();
// router.post("/", register);
router.post("/login", login);
router.post("/retailer/login",loginRetailer);
router.get("/logout", logout);
router.get("/transactions",protect,getTransactions);
router.route("/me").get( protect, authorize("Admin") , getMe);
router.put("updatedetails",protect, updateDetails);
router.put("/updatepassword", protect, updatePassword);
router.put("/updateTransactionPin", protect, updateTransactionPin);
module.exports = router;