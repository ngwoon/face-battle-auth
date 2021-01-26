const { 
    InvalidParamsError, 
    MissingRequiredParamsError, 
    DBError, 
    NotExistUserError, 
    NotValidUserError,
    InvalidAccessTokenError, 
    AxiosError,
} = require("../utils/errors");

const authService = require("../services/auth-service");

module.exports = {
    async normalLogIn(req, res, next) {
        const retBody = {
            success: {
                resultCode: "201",
                resultMsg: "로그인 성공",
                item: {},
            },
            fail: {
                invalidParams: {
                    resultCode: "400",
                    resultMsg: "유효하지 않은 매개변수",
                    item: {},
                },
                missingRequiredParams: {
                    resultCode: "400",
                    resultMsg: "필수 파라미터 누락",
                    item: {},
                },
                notExistUser: {
                    resultCode: "403",
                    resultMsg: "존재하지 않는 회원",
                    item: {},
                },
                notValidUser: {
                    resultCode: "403",
                    resultMsg: "인증되지 않은 회원",
                    item: {},
                },
                notExistUser: {
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

        try {
            const item = await authService.normalLogIn(email, password);
            retBody.success.item = item;
            res.status(201).json(retBody.success);
        } catch(error) {
            console.log(error);

            if(error instanceof InvalidParamsError)
                res.status(400).json(retBody.fail.invalidParams);
            
            else if(error instanceof MissingRequiredParamsError)
                res.status(400).json(retBody.fail.missingRequiredParams);
            
            else if(error instanceof NotValidUserError)
                res.status(403).json(retBody.fail.notValidUser);

            else if(error instanceof NotExistUserError)
                res.status(404).json(retBody.fail.notExistUser);
            
            else if(error instanceof DBError)
                res.status(500).json(retBody.fail.serverError);
        }
    },

    async socialLogIn(req, res, next) {
        const retBody = {
            success: {
                resultCode: "201",
                resultMsg: "소셜 로그인 성공",
                item: {},
            },
            fail: {
                invalidParams: {
                    resultCode: "400",
                    resultMsg: "유효하지 않은 매개변수",
                    item: {},
                },
                missingRequiredParams: {
                    resultCode: "400",
                    resultMsg: "필수 파라미터 누락",
                    item: {},
                },
                invalidAccessToken: {
                    resultCode: "401",
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
    
    
        const accessToken = req.body.accessToken;
        const type = req.body.type;
        const expiresIn = req.body.expiresIn;
        
        try {
            const item = await authService.socialLogIn(accessToken, type, expiresIn);
            retBody.success.item = item;
            res.status(201).json(retBody.success);
        } catch(error) {
            console.log(error);

            if(error instanceof InvalidParamsError)
                res.status(400).json(retBody.fail.invalidParams);

            else if(error instanceof MissingRequiredParamsError)
                res.status(400).json(retBody.fail.missingRequiredParams);

            else if(error instanceof InvalidAccessTokenError)
                res.status(401).json(retBody.fail.invalidAccessToken);
 
            else if(error instanceof AxiosError)
                res.status(500).json(retBody.fail.serverError);

            else if(error instanceof DBError)
                res.status(500).json(retBody.fail.serverError);
        }
    },
}