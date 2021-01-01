const express = require('express');
const emailVerification = require("../middlewares/email-verification.js");
const db = require("../models");
const router = express.Router();

router.get("/email", function(req, res, next) {
    res.render("verification");
});

router.post('/email', async function(req, res, next) {
    const code = req.body.code;
    const body = {};

    const result = await db.verification_code.findOne({ where: { code: code } });

    if(result.code) {
        if(result.expiry_date > Date.now()/1000) {
            body.resultCode = "00";
            body.resultMsg = "이메일 인증 성공";
            body.item = {};
        } else {
            body.resultCode = "01";
            body.resultMsg = "이메일 인증 실패. 인증 코드가 다릅니다.";
            body.item = {};
        }

        
    } else {
        body.resultCode = "02";
        body.resultMsg = "알 수 없는 오류. 인증 코드를 수신하지 않은 회원입니다.";
        body.item = {};
    }  

    res.json(body);
});

module.exports = router;
