const express = require('express');
const emailVerification = require("../middlewares/email-verification.js");
const db = require("../models");
const crypto = require("crypto");
const router = express.Router();


const VERIFICATION_EXPIRY_PERIOD = 300; 

/* GET home page. */
router.post('/', async function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const birth_date = req.body.birthDate;
    const question = req.body.question;
    const answer = req.body.answer;
    const type = 0;
    const valid = 0;

    console.log(`${email}, ${password}, ${name}, ${birth_date}, ${question}, ${answer}`);

    const body = {};

    db.user.findOne({ where: { email: email, type: type } })
    .then(user => {
        if(user) {
            body.resultCode = "01";
            body.resultMsg = "이미 가입된 회원";
            body.item = {};
            res.json(body);
        } else {

            // 패스워드 해싱
            const hashedPassword = crypto.createHash("sha256").update(password).digest("base64");
            
            // 회원 정보 저장
            db.user.create({
                email: email,
                password: hashedPassword,
                name: name,
                birth_date: birth_date,
                type: type,
                valid: valid,
            }).then(async (data) => {
                // 인증 메일 발송
                const result = await emailVerification.sendVerificationMail(email);
                
                // 발송 성공 시
                if(result.resultMsg === "success") {
                    const verificationCode = result.code;
                    db.verification_code.create({
                        code: verificationCode,
                        expiry_date: Date.now()/1000 + VERIFICATION_EXPIRY_PERIOD,
                        uid: data.uid,
                    }).then(_ => {
                        body.resultCode = "00";
                        body.resultMsg = "인증 메일 전송 성공";
                        body.item = {};
                    }).catch((error) => {

                        console.log("인증 코드 저장 실패");
                        console.log(error);

                        body.resultCode = "03";
                        body.resultMsg = "인증 코드 저장 실패";
                        body.item = {};
                    }).finally(() => {
                        res.json(body);
                    });
                } 
                // 발송 실패 시
                else {
                    body.resultCode = "02";
                    body.resultMsg = "인증 메일 전송 실패";
                    body.item = {};
                    res.json(body);
                }
            });
        }
    });
});



module.exports = router;
