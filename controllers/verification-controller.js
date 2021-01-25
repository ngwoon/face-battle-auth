const { 
    InvalidParamsError,
    MissingRequiredParamsError,
    DBError,
    ExceededExpiryDateError,
    NoVerificationCodeError,
    InconsistVerificationCodeError,
    SendEmailError,
    AlreadyValidUserError,
    NotExistUserError,
} = require("../utils/errors");

const verificationService = require("../services/verification-service");

module.exports = {

    async verifyPassword(req, res, next) {
        const retBody ={
            success: {
                resultCode: "200",
                resultMsg: "비밀번호 일치",
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
                inconsistPassword: {
                    resultCode: "404",
                    resultMsg: "비밀번호 일치하지 않음",
                    item: {},
                },
                serverError: {
                    resultCode: "500",
                    resultMsg: "서버 오류",
                    item: {},
                }
            },
        };

        const password = req.body.password;
        const email = res.locals.email;
        const type = res.locals.type;

        try {
            const isPasswordValid = await verificationService.verifyPassword(email, password, type);
            if(isPasswordValid)
                res.status(200).json(retBody.success);
            else
                res.status(404).json(retBody.fail.inconsistPassword);
        } catch(error) {
            console.log(error);

            if(error instanceof InvalidParamsError)
                res.status(400).json(retBody.fail.invalidParams);
            
            else if(error instanceof MissingRequiredParamsError)
                res.status(400).json(retBody.fail.missingRequiredParams);

            else if(error instanceof DBError)
                res.status(500).json(retBody.fail.serverError);
        }
    },

    async verifyEmail(req, res, next) {
        const retBody = {
            success: {
                resultCode: "200",
                resultMsg: "인증 코드 검증 성공",
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
                inconsistVerificationCode: {
                    resultCode: "400",
                    resultMsg: "인증 코드 일치하지 않음",
                    item: {},
                },
                exceededExpiryDate: {
                    resultCode: "401",
                    resultMsg: "인증 코드 만료 기간이 지남",
                    item: {},
                },
                notExistUser: {
                    resultCode: "403",
                    resultMsg: "존재하지 않는 회원",
                    item: {},
                },
                alreadyValidUser: {
                    resultCode: "403",
                    resultMsg: "이미 활성화된 회원",
                    item: {},
                },
                noVerificationCode: {
                    resultCode: "403",
                    resultMsg: "인증 코드를 발급받지 않음",
                    item: {},
                },
                serverError: {
                    resultCode: "500",
                    resultMsg: "서버 오류",
                    item: {},
                },
            },
        };
        
        const code = req.body.code;
        const email = req.body.email;
        
        try {
            const item = await verificationService.verifyEmail(email, code);
            retBody.success.item = item;
            res.status(200).json(retBody.success);
        } catch(error) {
            console.log(error);

            if(error instanceof InvalidParamsError)
                res.status(400).json(retBody.fail.invalidParams);

            if(error instanceof MissingRequiredParamsError)
                res.status(400).json(retBody.fail.missingRequiredParams);

            else if(error instanceof InconsistVerificationCodeError)
                res.status(400).json(retBody.fail.inconsistVerificationCode);
            
            else if(error instanceof ExceededExpiryDateError)
                res.status(401).json(retBody.fail.exceededExpiryDate);
            
            else if(error instanceof NotExistUserError)
                res.status(403).json(retBody.fail.notExistUser);
            
            else if(error instanceof AlreadyValidUserError)
                res.status(403).json(retBody.fail.alreadyValidUser);

            else if(error instanceof NoVerificationCodeError)
                res.status(403).json(retBody.fail.noVerificationCode);

            else if(error instanceof DBError)
                res.status(500).json(retBody.fail.serverError);
        }
    },

    async sendVerificationEmail(req, res, next) {
        const retBody = {
            success: {
                resultCode: "200",
                resultMsg: "이메일 인증 코드 발송 성공",
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
                alreadyValidUser: {
                    resultCode: "403",
                    resultMsg: "이미 활성화된 회원",
                    item: {},
                },
                serverError: {
                    resultCode: "500",
                    resultMsg: "서버 오류",
                    item: {},
                },
            }
        }

        const email = req.body.email;
    
        try {
            await verificationService.sendVerificationEmail(email);
            res.status(200).json(retBody.success);
        } catch(error) {
            console.log(error);

            if(error instanceof InvalidParamsError)
                res.status(400).json(retBody.fail.invalidParams);
            
            else if(error instanceof MissingRequiredParamsError)
                res.status(400).json(retBody.fail.missingRequiredParams);

            else if(error instanceof AlreadyValidUserError)
                res.status(403).json(retBody.fail.alreadyValidUser);

            else if(error instanceof NotExistUserError)
                res.status(403).json(retBody.fail.notExistUser);

            else if(error instanceof SendEmailError)
                res.status(500).json(retBody.fail.serverError);

            else if(error instanceof DBError)
                res.status(500).json(retBody.fail.serverError);
        }
    },
 
    
}