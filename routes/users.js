const express = require("express");

const {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getSuperDistributers,
  getDistributers,
  getRetailers,
  addSuperDistributerCreditPoint,
  reduceSuperDistributerCreditPoint,
  updateWinningPer,
  getWinningPer
} = require("../controllers/users");
const advancedResults = require("../middleware/advancedResults");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");


const router = express.Router();

//use middleware to protect, authorize
router.use(protect);
router.use(authorize("Admin"));
router.route("/").get(advancedResults(User), getUsers).post(createUser);
router.route("/getPercentage").get(getWinningPer);
router.route("/updatePercentage").put(updateWinningPer);
router.route("/addCreditPoint").post(addSuperDistributerCreditPoint);
router.route("/reduceCreditPoint").post(reduceSuperDistributerCreditPoint)
router.route("/superDistributers").get(getSuperDistributers);
router.route("/distributers").get(getDistributers);
router.route("/retailers").get(getRetailers);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);
module.exports = router;
