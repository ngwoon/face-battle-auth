const express = require('express');
const verificationController = require("../controllers/verification-controller");
const router = express.Router();
const { authenticateUser } = require("../middlewares/auth"); 

// 인증 코드 생성, 발송
router.post("/code", verificationController.sendVerificationEmail);

// 인증 코드 검증
router.post('/email', verificationController.verifyEmail);

// 비밀번호 검증
router.post("/password", authenticateUser, verificationController.verifyPassword);

module.exports = router;
