const express = require('express');
const crypto = require("crypto");
const axios = require("axios");

const db = require("../models");
const jwt = require("../modules/jwt");
const authController = require("../controllers/authController");
const router = express.Router();

router.post('/normal', authController.normalLogIn);
router.post("/oauth", authController.socialLogIn);


module.exports = router;
