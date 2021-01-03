const express = require('express');
const emailVerification = require("../middlewares/email-verification.js");
const db = require("../models");
const router = express.Router();

router.get("/email", function(req, res, next) {
    res.render("verification");
});

// verification-email
router.post("/", async function(req, res, next) {

    const retBody = {
        success: {
            resultCode: "00",
            resultMsg: "이메일 인증 코드 발송 성공",
            item: {},
        },
        fail: {
            resultCode: "01",
            resultMsg: "이메일 인증 코드 발송 실패",
            item: {},
        }
    }

    // DB에 생성한 인증 코드 row 
    // 이메일 전송 실패 시 row 삭제를 위해 보관
    let createdRow;
    
    // 현재 요청을 보낸 클라이언트 정보
    let currentUser;

    // 클라이언트 이메일
    const email = req.body.email;

    try {

        // 현재 회원이 이전에 요청한 인증코드 있는지 확인
        currentUser = await db.user.findOne({ where: { email: email, type: 0 } });
        const verificationCodeRow = await db.verification_code.findOne({ where: { uid: currentUser.uid } })
        
        // 새로운 인증코드 발급을 위해 해당 인증코드 삭제
        if(verificationCodeRow)
            await db.verification_code.destroy({ where: { code: verificationCodeRow.code } });

    } catch(error) {
        console.log("만료된 인증코드 삭제 오류");
        console.log(error);
        res.json(retBody.fail);
        return;
    }


    try {
        // 인증 코드 생성
        const verificationCode = emailVerification.createVerificationCode();

        // 인증 코드 저장
        createdRow = await db.verification_code.create({
            code: verificationCode,
            expiry_date: Date.now()/1000 + emailVerification.VERIFICATION_EXPIRY_PERIOD,
            uid: currentUser.uid,
        });
    } catch(error) {
        console.log("인증 코드 저장 실패");
        console.log(error);
        res.json(retBody.fail);
        return;
    }

    try {
        // 인증 메일 발송
        const sendMailResult = await emailVerification.sendVerificationMail(email);
    } catch(error) {
        console.log("인증코드 이메일 전송 실패");
        console.log(error);

        res.json(retBody.fail);

        try {
            await db.verification_code.destroy({ where: { uid: createdRow.uid } });
        } catch(error) {
            console.log("새로 생성한 인증코드 row 삭제 오류");
            console.log(error);
        }
    }
});

router.post('/email', async function(req, res, next) {
    const code = req.body.code;
    const body = {};

    const result = await db.verification_code.findOne({ where: { code: code } });

    if(result) {

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
