const express = require('express');
const crypto = require("crypto");
const db = require("../models");
const router = express.Router();

// 회원정보 등록
router.post('/', async function(req, res, next) {
    
    const retBody = {
        success: {
            resultCode: "201",
            resultMsg: "회원정보 저장 성공",
            item: {},
        },
        fail: {
            invalidParams: {
                resultCode: "400",
                resultMsg: "필수 파라미터 존재하지 않음",
                item: {},
            },
            serverError: {
                resultCode: "500",
                resultMsg: "서버 오류",
                item: {},
            },
        },
    };
    
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const birthDate = req.body.birthDate;
    const qid = req.body.qid;
    const answer = req.body.answer;
    const type = 0;
    const valid = 0;

    if(!(email && password && name && birthDate && qid && answer)) {
        next(retBody.fail.invalidParams);
        return;
    }

    console.log(`${email}, ${password}, ${name}, ${birthDate}, ${qid}, ${answer}`);
    
    // 패스워드 해싱
    const hashedPassword = crypto.createHash("sha256").update(password).digest("base64");

    try {
        // 회원 정보 저장
        await db.sequelize.transaction(async (t) => {
            const createdUser = await db.user.create({
                email: email,
                password: hashedPassword,
                name: name,
                birth_date: birthDate,
                type: type,
                valid: valid,
            });

            await db.user_question.create({
                uid: createdUser.uid,
                qid: qid,
                answer: answer,
            });
        });
        res.status(200).json(retBody.success);
    } catch(error) {
        console.log("회원정보 저장 실패");
        console.log(error);
        next(retBody.fail.serverError);
    }
});


// 중복 이메일 확인
router.post("/check/email", async function(req, res, next) {
    const retBody = {
        success: {
            resultCode: "200",
            resultMsg: "중복된 이메일 없음",
            item: {},
        },
        fail: {
            duplicatedEmailExists: {
                resultCode: "404",
                resultMsg: "중복된 이메일 존재",
                item: {},
            },
            serverError: {
                resultCode: "500",
                resultMsg: "서버 오류",
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
            next(retBody.fail.duplicatedEmailExists);

        // 중복된 이메일 없을 시
        else
            res.status(200).json(retBody.success);

    } catch(error) {
        console.log("DB 중복 이메일 확인 오류");
        console.log(error);
        next(retBody.fail.serverError);
    }
});



module.exports = router;
