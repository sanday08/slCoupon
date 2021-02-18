const express = require('express');
const{getRetailers,getDistributers,addDistributerCreditPoint}=require("../controllers/superDistributers")
const { protect, authorize } = require("../middleware/auth");


const router = express.Router();

//use middleware to protect, authorize
router.use(protect);
router.use(authorize("superDistributer"));
router.route("/addCreditPoint").post(addDistributerCreditPoint);
router.route("/distributers").get(getDistributers);
router.route("/retailers").get(getRetailers);
module.exports = router;