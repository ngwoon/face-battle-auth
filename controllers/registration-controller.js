const { 
    InvalidParamsError, 
    MissingRequiredParamsError, 
    DBError, 
    DuplicatedEmailError, 
    AlreadyExistUserError, 
} = require("../utils/errors");

const registrationService = require("../services/registration-service");

module.exports = {
    async registrateUser(req, res, next) {
        const retBody = {
            success: {
                resultCode: "201",
                resultMsg: "회원정보 저장 성공",
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
                alreadyExistUser: {
                    resultCode: "403",
                    resultMsg: "이미 존재하는 회원",
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
    
        try {
            await registrationService.registrateUser(email, password, name, birthDate, qid, answer);
            res.status(201).json(retBody.success);
        } catch(error) {
            console.log(error);
            
            if(error instanceof InvalidParamsError)
                res.status(400).json(retBody.fail.invalidParams);

            else if(error instanceof MissingRequiredParamsError)
                res.status(400).json(retBody.fail.missingRequiredParams);
            
            else if(error instanceof AlreadyExistUserError)
                res.status(400).json(retBody.fail.alreadyExistUser);

            else if(error instanceof DBError)
                res.status(500).json(retBody.fail.serverError);
        }
    },

    async checkEmailDuplication(req, res, next) {
        const retBody = {
            success: {
                resultCode: "200",
                resultMsg: "중복된 이메일 없음",
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
    
        try {
            await registrationService.checkEmailDuplication(email);
            res.status(200).json(retBody.success);
        } catch(error) {
            console.log(error.stack);

            if(error instanceof InvalidParamsError)
                res.status(400).json(retBody.fail.invalidParams);

            if(error instanceof MissingRequiredParamsError)
                res.status(400).json(retBody.fail.missingRequiredParams);

            else if(error instanceof DuplicatedEmailError)
                res.status(404).json(retBody.fail.duplicatedEmailExists);
            
            else if(error instanceof DBError)
                res.status(500).json(retBody.fail.serverError);
        }
    }
}