const express = require('express');
const authController = require("../controllers/auth-controller");
const router = express.Router();

router.post('/normal', authController.normalLogIn);
router.post("/oauth", authController.socialLogIn);

module.exports = router;
