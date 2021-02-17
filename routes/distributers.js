const express = require('express');

const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");


const router = express.Router();

//use middleware to protect, authorize
router.use(protect);
router.use(authorize("distributers"));

router.route("/distributers").get(getDistributers);
router.route("/retailers").get(getRetailers);