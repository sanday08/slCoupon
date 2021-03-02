const express = require('express');
const { getDistributers, addDistributerCreditPoint, reduceDistributerCreditPoint, getSingleDistributers } = require("../controllers/superDistributers")
const { protect, authorize } = require("../middleware/auth");


const router = express.Router();

//use middleware to protect, authorize
router.use(protect);
router.use(authorize("superDistributer"));
router.route("/addCreditPoint").post(addDistributerCreditPoint);
router.route("/reduceCreditPoint").post(reduceDistributerCreditPoint);
router.route("/distributers").get(getDistributers);
router.route("/distributers/:id").get(getSingleDistributers);
module.exports = router;