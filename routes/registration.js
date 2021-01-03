const express = require('express');
const crypto = require("crypto");
const db = require("../models");
const router = express.Router();

/* GET home page. */
router.post('/', async function(req, res, next) {
    
    const retBody = {
        success: {
            resultCode: "00",
            resultMsg: "회원정보 저장 성공",
            item: {},
        },
        fail: {
            resultCode: "01",
            resultMsg: "회원정보 저장 실패",
            item: {},
        },
    };
    
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const birth_date = req.body.birthDate;
    const question = req.body.question;
    const answer = req.body.answer;
    const type = 0;
    const valid = 0;

    console.log(`${email}, ${password}, ${name}, ${birth_date}, ${question}, ${answer}`);
    
    // 패스워드 해싱
    const hashedPassword = crypto.createHash("sha256").update(password).digest("base64");

    try {
        // 회원 정보 저장
        await db.user.create({
            email: email,
            password: hashedPassword,
            name: name,
            birth_date: birth_date,
            type: type,
            valid: valid,
        });
        res.json(retBody.success);
    } catch(error) {
        console.log("회원정보 저장 실패");
        console.log(error);
        res.json(retBody.fail);
    }
});



module.exports = router;
