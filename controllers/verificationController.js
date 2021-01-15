const { InvalidParamsError, DBError, ExceededExpiryDateError, NoVerificationCodeError, InconsistVerificationCodeError, SendEmailError, AlreadyValidUserError, NotExistUserError } = require("../errors");
const verificationService = require("../services/verificationService");

module.exports = {
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
                    resultMsg: "필수 파라미터 누락",
                    item: {},
                },
                alreadyValidUser: {
                    resultCode: "400",
                    resultMsg: "이미 활성화된 회원",
                    item: {},
                },
                notExistUser: {
                    resultCode: "400",
                    resultMsg: "존재하지 않는 회원",
                    item: {},
                },
                cannotSendEmail: {
                    resultCode: "500",
                    resultMsg: "이메일 인증 코드 발송 실패",
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

            else if(error instanceof AlreadyValidUserError)
                res.status(400).json(retBody.fail.alreadyValidUser);

            else if(error instanceof NotExistUserError)
                res.status(400).json(retBody.fail.notExistUser);

            else if(error instanceof SendEmailError)
                res.status(500).json(retBody.fail.cannotSendEmail);

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
                    resultMsg: "필수 파라미터 누락",
                    item: {},
                },
                notExistUser: {
                    resultCode: "400",
                    resultMsg: "존재하지 않는 회원",
                    item: {},
                },
                exceededExpiryDate: {
                    resultCode: "400",
                    resultMsg: "인증 코드 만료 기간이 지남",
                    item: {},
                },
                inconsistVerificationCode: {
                    resultCode: "400",
                    resultMsg: "인증 코드 일치하지 않음",
                    item: {},
                },
                noVerificationCode: {
                    resultCode: "400",
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
            await verificationService.verifyEmail(email, code);
            res.status(200).json(retBody.success);
        } catch(error) {
            console.log(error);

            if(error instanceof InvalidParamsError)
                res.status(400).json(retBody.fail.InvalidParamsError);

            else if(error instanceof NotExistUserError)
                res.status(400).json(retBody.fail.notExistUser);

            else if(error instanceof ExceededExpiryDateError)
                res.status(400).json(retBody.fail.exceededExpiryDate);

            else if(error instanceof InconsistVerificationCodeError)
                res.status(400).json(retBody.fail.inconsistVerificationCode);

            else if(error instanceof NoVerificationCodeError)
                res.status(400).json(retBody.fail.noVerificationCode);

            else if(error instanceof DBError)
                res.status(500).json(retBody.fail.serverError);
        }
    }
}