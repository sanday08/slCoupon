const express = require('express');
const User = require("../models/User");
const{}=require("../controllers/distributers")
const { protect, authorize } = require("../middleware/auth");


const router = express.Router();

//use middleware to protect, authorize
router.use(protect);
router.use(authorize("superDistributer"));
router.route("/").get(getUsers).post(createUser);
router.route("distributers/").get(getDistributers);