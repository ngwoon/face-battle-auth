const express = require('express');
const db = require("../models");
const emailVerification = require("../middlewares/email-verification.js");
const jwt = require("../middlewares/jwt");
const router = express.Router();

router.get("/email", function(req, res, next) {
    res.render("verification");
});

// verification code
router.post("/code", async function(req, res, next) {

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

    // 새로 생성한 인증 코드
    let verificationCode;

    // 클라이언트 이메일
    const email = req.body.email;

    try {

        // 현재 회원이 이전에 요청한 인증코드 있는지 확인
        currentUser = await db.user.findOne({ where: { email: email, type: 0 } });
        const verificationCodeRow = await db.verification_code.findOne({ where: { uid: currentUser.uid } })
        
        // 새로운 인증코드 발급을 위해 해당 인증코드 삭제
        if(verificationCodeRow)
            await db.verification_code.destroy({ where: { uid: currentUser.uid } });

    } catch(error) {
        console.log("만료된 인증코드 삭제 오류");
        console.log(error);
        res.json(retBody.fail);
        return;
    }

    try {
        // 인증 코드 생성
        verificationCode = emailVerification.createVerificationCode();

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
        await emailVerification.sendVerificationMail(email, verificationCode);
        res.json(retBody.success);
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
    const retBody = {
        success: {
            resultCode: "00",
            resultMsg: "인증 코드 검증 성공",
            item: {},
        },
        fail: {
            exceededExpiryDate: {
                resultCode: "01",
                resultMsg: "인증 코드 일치하지 않음",
                item: {},
            },
            inconsistVerificationCode: {
                resultCode: "02",
                resultMsg: "인증 코드 만료 기간이 지남",
                item: {},
            },
            serverError: {
                resultCode: "03",
                resultMsg: "서버 오류",
                item: {},
            },
        },
    };
    
    const code = req.body.code;
    const email = req.body.email;
    const type = 0;
    let currentUser, verificationCodeRow;

    try {
        currentUser = await db.user.findOne({ where: { email: email, type: type } });
        verificationCodeRow = await db.verification_code.findOne({ where: { uid: currentUser.uid } });
    } catch(error) {
        console.log("DB 인증 코드 탐색 오류");
        console.log(error);
        res.status(500).json(retBody.fail.serverError);
        return;
    }



    // DB에 일치하는 인증 코드가 존재하는 경우
    if(verificationCodeRow && verificationCodeRow.code === code) {

        const currentDate = Date.now() / 1000;

        // 만료 기간이 유효한 경우
        if(verificationCodeRow.expiry_date >= currentDate) {
            try {

                await db.sequelize.transaction(async (t) => {
                    await db.user.update({ valid: 1 }, { where : { uid: verificationCodeRow.uid }, transaction: t});
                    await db.verification_code.destroy({ where: { code: code }, transaction: t});
                });

                // JWT 토큰 생성
                createdJWT = jwt.createJWT(email, currentUser.name, type);
                retBody.success.item.jwt = createdJWT;

                res.status(200).json(retBody.success);

            } catch(error) {
                console.log("회원 활성화 실패");
                console.log(error);
                res.status(500).json(retBody.fail.serverError);
            }
        } 
        // 만료 기간이 지난 경우
        else if(verificationCodeRow.expiry_date < currentDate)
            res.status(200).json(retBody.fail.exceededExpiryDate);
    } 

    // DB에 일치하는 인증 코드가 없는 경우
    else
        res.status(200).json(retBody.fail.inconsistVerificationCode);

});

module.exports = router;
