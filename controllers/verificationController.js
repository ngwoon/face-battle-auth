const verificationService = require("../services/verificationService");
const { InvalidParamsError, DBError, ExceededExpiryDateError, NoVerificationCodeError, SendEmailError } = require("../errors");

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

            else if(error instanceof ExceededExpiryDateError)
                res.status(400).json(retBody.fail.exceededExpiryDate);

            else if(error instanceof inconsistVerificationCodeError)
                res.status(400).json(retBody.fail.inconsistVerificationCode);

            // else if(error instanceof NoVerificationCodeError)
            //     res.status(500).json(retBody.fail.serverError);

            else if(error instanceof DBError)
                res.status(500).json(retBody.fail.serverError);
        }
    }
}