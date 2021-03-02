const express = require('express');
const { getRetailers, addRetailerCreditPoint, reduceRetailerCreditPoint, getSingleRetailers } = require("../controllers/distributers")
const { protect, authorize } = require("../middleware/auth");
const router = express.Router();
//use middleware to protect, authorize
router.use(protect);
router.route("/addCreditPoint").post(addRetailerCreditPoint);
router.route("/reduceCreditPoint").post(reduceRetailerCreditPoint);
router.use(authorize("distributer"));
router.route("/retailers/:id").get(getSingleRetailers);
router.route("/retailers").get(getRetailers);
module.exports = router;