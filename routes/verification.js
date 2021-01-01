const express = require('express');
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const router = express.Router();

const HASH_STRING = "Face Battle";
const ADMIN_MAIL_ADDRESS = "todory2002@gmail.com";
const ADMIN_MAIL_PASSWORD = "rhksdn1996!";
const MAIL_SUBJECT = "[no-reply] Face Battle 앱의 인증코드";
const MAIL_CONTENT = "Face Battle 앱에 회원이 된 것을 축하드립니다!\n \
                    이메일 인증을 위해 아래 코드를 입력해 주세요.\n \
                    <h2>";

router.post('/email', function(req, res, next) {
    const clientEmail = req.body.email;
    let body;

    // TODO 관리자 이메일 비밀번호 숨겨야함.
    const mail = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: ADMIN_MAIL_ADDRESS,
            pass: ADMIN_MAIL_PASSWORD,
        },
    });

    // 인증 코드 생성
    const hashString = crypto.createHash("sha256").update(HASH_STRING).digest("base64");
    const randNum = Math.floor(Math.random() * 200);
    const verificationCode = hashString.slice(randNum, randNum + 6);

    const mailOptions = {
        from: ADMIN_MAIL_ADDRESS,
        to: clientEmail,
        subject: MAIL_SUBJECT,
        html: MAIL_CONTENT + verificationCode + "</h2>",
    };

    mail.sendMail(mailOptions, (error, info) => {
        if(error) {
            body = {
                resultCode: "01",
                resultMsg: "이메일 전송 에러",
                data: "실패"
            };
            console.log("회원에게 이메일 전송 에러");
            console.log(error);
        } else {
            body = {
                resultCode: "00",
                resultMsg: "이메일 전송 완료",
                data: "성공"
            };
        }
        res.send(JSON.stringify(body));
    });
});

module.exports = router;
