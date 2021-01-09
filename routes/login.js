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
            serverError: {
                resultCode: "500",
                resultMsg: "서버 오류",
                item: {},
            }
        },
    }

    const urls = ["", "카카오 url", "https://openapi.naver.com/v1/nid/me", "https://www.googleapis.com/oauth2/v3/userinfo?access_token"]

    const accessToken = req.body.accessToken;
    const type = req.body.type;
    const expiresIn = req.body.expiresIn;

    console.log(`${accessToken}, ${type}, ${expiresIn}`);

    let email, name;

    switch(type) {
        case 1:
            
            break;

            
        case 2:
            axios({
                url: urls[type],
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }).then((data) => {
                console.log(data);
                console.log("네이버 access token 인증 완료");
                res.status(200).send("nice");
            }).catch(error => {
                console.log("네이버 access token 에러");
                res.status(400).send("nice");
            });
            console.log("네이버 axios");
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

                // 유효하지 않은 토큰일 때
                if(error.response.data.error) {
                    next(retBody.fail.invalidAccessToken);
                    return;
                }
                
                // axios 자체 실패
                console.log("구글 접근 토큰 검증 axios 실패");
                next(retBody.fail.serverError);
                return;
            }

            break;
    }


    // JWT 생성 및 성공 응답 리턴
    const createdJWT = console.log(email, name, type, expiresIn);
    retBody.success.item.jwt = createdJWT;
    res.status(201).json(retBody.success);



    /*
        회원가입 필요한 회원인지 확인. 필요하다면 회원정보 저장
        만약 저장 중 오류가 발생해도, 다음 소셜 로그인 시 저장 여부를 확인하므로 별다른 처리가 필요 없음
        이에 비동기 처리함
    */
    db.user.findOne({ where : { email: email, type: type } })
    .then(data => {
        if(!data) {
            db.user.create({
                email: email,
                password: null,
                name: name,
                birth_date: null,
                type: type,
                valid: 1,
            })
            .then(_ => {})
            .catch(error => {
                if(error) {
                    console.log("소셜 회원 DB 저장 오류");
                    console.log(error);
                }
            });
        }
    })
    .catch(error => {
        if(error) {
            console.log("DB 조회 오류");
            console.log(error);
        }
    });
});


module.exports = router;
