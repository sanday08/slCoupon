const express = require('express');
const { getWinnerResultsByDate, claimeTicket, getBetHistroy, getOnlineRetailers, getAllBetHistroy, addComplaint } = require("../controllers/retailers")
const { protect, authorize } = require("../middleware/auth");


const router = express.Router();

//use middleware to protect, authorize
router.use(protect);
router.get("/betHistroy/", getAllBetHistroy)
router.get("/betHistroy/:retailerId", getBetHistroy)
router.get("/online", getOnlineRetailers);

router.use(authorize("retailer"));
// router.route("/addCreditPoint").post(addDistributerCreditPoint);
// router.route("/reduceCreditPoint").post(reduceDistributerCreditPoint);
// router.route("/distributers").get(getDistributers);
// router.route("/retailers").get(getRetailers);

router.route("/winResultByDate/:date").get(getWinnerResultsByDate);
router.route("/claim").put(claimeTicket);
router.route("/complaint").post(addComplaint);
module.exports = router;