const express = require('express');
const crypto = require("crypto");
const db = require("../models");
const jwt = require("../middlewares/jwt");
const router = express.Router();

router.post('/normal', async function(req, res, next) {
    const retBody = {
        success: {
            resultCode: "201",
            resultMsg: "로그인 성공",
            item: {},
        },
        fail: {
            invalidParams: {
                resultCode: "400",
                resultMsg: "필수 파라미터가 존재하지 않음",
                item: {},
            },
            inconsistentUserInfo: {
                resultCode: "404",
                resultMsg: "일치하는 회원 없음",
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
    const type = 0;

    console.log(email, password);

    // 클라이언트가 필수 파라미터를 충족시키지 않았을 경우
    if(!(email && password)) {
        res.status(400).json(retBody.fail.invalidParams);
        return;
    }
    


    const hashedPassword = crypto.createHash("sha256").update(password).digest("base64");
    let currentUser;

    try {
        currentUser = await db.user.findOne({ where: { email: email, password: hashedPassword, type: type }, raw: true });

        if(currentUser) {
            // JWT 토큰 생성
            const createdJWT = jwt.createJWT(email, currentUser.name, type);

            // 클라이언트에게 전달할 유저 정보에서 패스워드 제외
            delete currentUser.password;

            // 반환 item에 사용자 정보, JWT 삽입
            retBody.success.item.userInfo = currentUser;
            retBody.success.item.jwt = createdJWT;

            res.status(201).json(retBody.success);
        } else
            res.status(404).json(retBody.fail.inconsistentUserInfo);

    } catch(error) {
        console.log("DB 조회 오류");
        console.log(error);

        res.status(500).json(retBody.fail.serverError);
        return;
    }
});


router.post("/oauth", function(req, res, next) {

});


module.exports = router;
