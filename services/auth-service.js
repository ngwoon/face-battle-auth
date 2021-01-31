
const { 
    InvalidParamsError, 
    MissingRequiredParamsError, 
    DBError, 
    InvalidAccessTokenError, 
    NotExistUserError,
    NotValidUserError,
    AxiosError,
}                       = require("../utils/errors");
const { 
    DB_USER_FIND_ERR_MSG, 
    DB_USER_CREATE_ERR_MSG,
}                       = require("../utils/error-messages");
const { verifyParams }  = require("../modules/verify-params");
const db                = require("../models");
const jwt               = require("../modules/jwt");
const crypto            = require("crypto");
const axios             = require("axios");

module.exports = {
    async normalLogIn(email, password) {

        const verifyResult = verifyParams({email, password});
        if(verifyResult.isParamMissed)
            throw new MissingRequiredParamsError();
        
        if(verifyResult.isParamInvalid)
            throw new InvalidParamsError();

        
    
        const type              = 0;    // 이 함수는 일반 유저만 접근할 수 있으므로 type을 0으로 고정한다.
        const item              = {};   // 로그인 성공 시 클라이언트에게 반환할 객체. jwt, userInfo가 담길 예정이다.
        const hashedPassword    = crypto.createHash("sha256").update(password).digest("base64");
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
            throw new DBError(DB_USER_FIND_ERR_MSG, error);
        }
        
        if(currentUser) {
            if(!currentUser.valid)
                throw new NotValidUserError();

            const createdJWT = jwt.createJWT(email, currentUser.name, type);
            delete currentUser.password;    // 클라이언트에게 전달할 유저 정보에서 패스워드 제외
            item.userInfo = currentUser;    // 반환 item에 사용자 정보, JWT 삽입
            item.jwt = createdJWT;

            return item;
        } 
        // 유저가 존재하지 않을 경우
        else
            throw new NotExistUserError();
    },

    async socialLogIn(accessToken, type, expiresIn) {
    
        /*
            accessToken, expiresIn은 유저가 선택한 소셜 플랫폼에 따라 달라지므로
            verifyParams로 검사하지 않는다.
            대신, accessToken은 뒤에서 소셜 플랫폼에 요청을 날려 유효성을 확인한다.
        */
        if(!(accessToken && type && expiresIn))
            throw new MissingRequiredParamsError();

        if(!(type >= 1 && type <= 3))
            throw new InvalidParamsError();



        const urls = ["", "https://kapi.kakao.com/v2/user/me", "https://openapi.naver.com/v1/nid/me", "https://www.googleapis.com/oauth2/v3/userinfo?access_token"];
        const item = {};
        let email, name, currentUser;
        // 접근 토큰 검증
        try {
            // Kakao
            if(type === 1) {
                const axiosResponse = await axios.get({
                    url: urls[type],
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    }
                });

                email = axiosResponse.data.kakao_account.email;
                name = axiosResponse.data.properties.nickname;
            }

            // Naver
            else if(type === 2) {
                const axiosResponse = await axios.get({
                    url: urls[type],
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                });

                email = axiosResponse.data.response.email;
                name = axiosResponse.data.response.name;
            }

            // Google
            else if(type === 3) {
                const axiosResponse = await axios.get({
                    url: `${urls[type]}=${accessToken}`,
                });

                email = axiosResponse.data.email;
                name = axiosResponse.data.name;
            }

        } catch(error) {
            if(error.response)
                throw new InvalidAccessTokenError(error);
            else
                throw new AxiosError(error);
        }

        

        /* 
            등록된 소셜 회원인지 확인
            등록되어 있지 않다면 등록
        */
        try {
            currentUser = await db.user.findOne({ where : { email, type }, raw: true });
        } catch(error) {
            throw new DBError(DB_USER_FIND_ERR_MSG);
        }

        if(!currentUser) {
            try {
                currentUser = await db.user.create({
                    email,
                    password: null,
                    name,
                    birth_date: null,
                    type,
                    valid: 1,
                }, { raw: true });
            } catch(error) {
                throw new DBError(DB_USER_CREATE_ERR_MSG);
            }
        }
    

        
        const createdJWT = jwt.createJWT(email, name, type, expiresIn);
        delete currentUser.password;    // 클라이언트에게 전달할 유저 정보에서 패스워드 제외
        item.jwt = createdJWT;          // 반환 item에 사용자 정보, JWT 삽입
        item.userInfo = currentUser;
        
        return item;
    },
}