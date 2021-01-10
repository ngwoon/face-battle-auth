const express = require('express');
const crypto = require("crypto");
const axios = require("axios");

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

    // 클라이언트가 필수 파라미터를 충족시키지 않았을 경우
    if(!(email && password))
        return next(retBody.fail.invalidParams);


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
            next(retBody.fail.inconsistentUserInfo);

    } catch(error) {
        console.log("DB 조회 오류");
        console.log(error);
        next(retBody.fail.serverError);
    }
});


router.post("/oauth", async function(req, res, next) {

    const retBody = {
        success: {
            resultCode: "200",
            resultMsg: "소셜 로그인 성공",
            item: {},
        },
        fail: {
            invalidAccessToken: {
                resultCode: "400",
                resultMsg: "유효하지 않은 접근 토큰",
                item: {},
            },
            invalidParams: {
                resultCode: "400",
                resultMsg: "필수 파라미터 누락",
                item: {},
            },
            serverError: {
                resultCode: "500",
                resultMsg: "서버 오류",
                item: {},
            }
        },
    }

    const urls = ["", "https://kapi.kakao.com/v2/user/me", "https://openapi.naver.com/v1/nid/me", "https://www.googleapis.com/oauth2/v3/userinfo?access_token"]

    const accessToken = req.body.accessToken;
    const type = req.body.type;
    const expiresIn = req.body.expiresIn;

    let email, name, currentUser;

    // console.log(`${accessToken}, ${type}, ${expiresIn}`);

    // 필수 파라미터 확인
    if(!(accessToken && type && expiresIn))
        return next(retBody.fail.invalidParams);

    switch(type) {
        case 1:
            try {
                const asResponse = await axios({
                    url: urls[type],
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    }
                });

                email = asResponse.data.kakao_account.email;
                name = asResponse.data.properties.nickname;

            } catch(error) {
                return next(retBody.fail.invalidAccessToken);
            }
            break;
            
        case 2:
            try {
                const asResponse = await axios({
                    url: urls[type],
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                });
        
                email = asResponse.data.response.email;
                name = asResponse.data.response.name;

            } catch(error) {
                return next(retBody.fail.invalidAccessToken);
            }
            break;

        case 3:
            try {
                const asResponse = await axios({
                    url: `${urls[type]}=${accessToken}`,
                    method: "get",
                });

                email = asResponse.data.email;
                name = asResponse.data.name;

            } catch(error) {
                return next(retBody.fail.invalidAccessToken);
            }
            break;
    }
    

    try {
        currentUser = await db.user.findOne({ where : { email: email, type: type }, raw: true });
        
        if(!currentUser) {
            currentUser = await db.user.create({
                email,
                password: null,
                name,
                birth_date: null,
                type,
                valid: 1,
            }, { raw: true });
        }

    } catch(error) {
        console.log("소셜 회원 DB 저장 오류");
        console.log(error);
        return next(retBody.fail.serverError);
    }


    // JWT 생성
    const createdJWT = jwt.createJWT(email, name, type, expiresIn);

    // 클라이언트에게 전달할 유저 정보에서 패스워드 제외
    delete currentUser.password;

    // 반환 item에 사용자 정보, JWT 삽입
    retBody.success.item.jwt = createdJWT;
    retBody.success.item.userInfo = currentUser;

    res.status(200).json(retBody.success);
});


module.exports = router;
