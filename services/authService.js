
const { InvalidParamsError, DBError, InvalidAccessTokenError, NotExistUserError } = require("../errors");
const db = require("../models");
const jwt = require("../modules/jwt");
const crypto = require("crypto");
const axios = require("axios");

module.exports = {
    async normalLogIn(email, password) {

        // 클라이언트가 필수 파라미터를 충족시키지 않았을 경우
        if(!(email && password))
            throw new InvalidParamsError();
    
        const type = 0;
        const hashedPassword = crypto.createHash("sha256").update(password).digest("base64");
        const item = {};
        let currentUser;
    
        try {
            currentUser = await db.user.findOne({ 
                where: { 
                    email, 
                    type,
                    password: hashedPassword, 
                }, 
                raw: true,
            });
        } catch(error) {
            throw new DBError("일반 로그인 DB 조회 오류", error);
        }
        
        if(currentUser) {
            // JWT 토큰 생성
            const createdJWT = jwt.createJWT(email, currentUser.name, type);

            // 클라이언트에게 전달할 유저 정보에서 패스워드 제외
            delete currentUser.password;

            // 반환 item에 사용자 정보, JWT 삽입
            item.userInfo = currentUser;
            item.jwt = createdJWT;

            return item;
        } else
            throw new NotExistUserError();
    },

    async socialLogIn(accessToken, type, expiresIn) {
        
        const urls = ["", "https://kapi.kakao.com/v2/user/me", "https://openapi.naver.com/v1/nid/me", "https://www.googleapis.com/oauth2/v3/userinfo?access_token"];
        const item = {};
        let email, name, currentUser;
    
        // 필수 파라미터 확인
        if(!(accessToken && type && expiresIn))
            throw new InvalidParamsError();


        console.log(accessToken, type, expiresIn);

        // 접근 토큰 검증
        try {
            // Kakao
            if(type === 1) {
                const axiosResponse = await axios({
                    url: urls[type],
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    }
                });

                email = axiosResponse.data.kakao_account.email;
                name = axiosResponse.data.properties.nickname;
            }

            // Naver
            else if(type === 2) {
                const axiosResponse = await axios({
                    url: urls[type],
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                });

                email = axiosResponse.data.response.email;
                name = axiosResponse.data.response.name;
            }

            // Google
            else if(type === 3) {
                const axiosResponse = await axios({
                    url: `${urls[type]}=${accessToken}`,
                    method: "get",
                });

                email = axiosResponse.data.email;
                name = axiosResponse.data.name;
            }
        } catch(error) {
            throw new InvalidAccessTokenError(error);
        }

        
        // 등록된 소셜 회원인지 확인
        // 등록되어 있지 않다면 등록
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
            throw new DBError("소셜 회원 DB 조회 오류");
        }
    
    
        // JWT 생성
        const createdJWT = jwt.createJWT(email, name, type, expiresIn);
    
        // 클라이언트에게 전달할 유저 정보에서 패스워드 제외
        delete currentUser.password;
    
        // 반환 item에 사용자 정보, JWT 삽입
        item.jwt = createdJWT;
        item.userInfo = currentUser;
        
        return item;
    },

}