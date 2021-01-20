const express = require('express');
const registrationController = require("../controllers/registration-controller");
const router = express.Router();

// 회원정보 등록
router.post('/', registrationController.registrateUser);

// 중복 이메일 확인
router.post("/check/email", registrationController.checkEmailDuplication);



module.exports = router;
