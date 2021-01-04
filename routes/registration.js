const express = require('express');
const crypto = require("crypto");
const db = require("../models");
const router = express.Router();

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

router.post("/check/email", async function(req, res, next) {
    const retBody = {
        success: {
            resultCode: "00",
            resultMsg: "중복된 이메일 없음",
            item: {},
        },
        fail: {
            duplicatedEmailExists: {
                resultCode: "01",
                resultMsg: "중복된 이메일 존재",
                item: {},
            },
            serverError: {
                resultCode: "02",
                resultMsg: "서버 에러",
                item: {},  
            },
        },
    };

    const email = req.body.email;
    const type = 0;

    try {
        const duplicatedUser = await db.user.findOne({ where: { email: email, type: type } });

        // 중복된 이메일 존재 시
        if(duplicatedUser)
            res.status(200).json(retBody.fail.duplicatedEmailExists);

        // 중복된 이메일 없을 시
        else
            res.status(200).json(retBody.success);

    } catch(error) {
        console.log("DB 중복 이메일 확인 오류");
        console.log(error);
        res.status(500).json(retBody.fail.serverError);
    }
});



module.exports = router;
