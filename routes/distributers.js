const express = require('express');
const{getRetailers,addRetailerCreditPoint}=require("../controllers/distributers")
const { protect, authorize } = require("../middleware/auth");
const router = express.Router();
//use middleware to protect, authorize
router.use(protect);
router.route("/addCreditPoint").post(addRetailerCreditPoint)
router.use(authorize("distributer"));
router.route("/retailers").get(getRetailers);
module.exports = router;  