const express = require('express');
const verificationController = require("../controllers/verification-controller");
const router = express.Router();

// 인증 코드 생성, 발송
router.post("/code", verificationController.sendVerificationEmail);

// 인증 코드 검증
router.post('/email', verificationController.verifyEmail);

module.exports = router;
