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

        const currentDate = Date.now() / 1000;
        if(result.expiry_date > currentDate) {
            body.resultCode = "00";
            body.resultMsg = "이메일 인증 성공";
            body.item = {};

            db.user.update({ valid: 1 }, { where : { uid: result.uid } });

        } else if(result.expiry_date <= currentDate) {
            body.resultCode = "01";
            body.resultMsg = "이메일 인증 실패. 만료 기간이 지났습니다.";
            body.item = {};
        }
        db.verification_code.destroy({ where: { code: code } });

    } else {
        body.resultCode = "02";
        body.resultMsg = "이메일 인증 실패. 인증 코드가 다릅니다.";
        body.item = {};
    }  

    res.json(body);
});

module.exports = router;
