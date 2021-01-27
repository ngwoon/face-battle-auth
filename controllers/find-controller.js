const { 
    InvalidParamsError,
    MissingRequiredParamsError,
    NotExistUserError,
    DBError,
    InconsistAnswerError,
} = require("../utils/errors");

const findService = require("../services/find-service");

module.exports = {
    async findEmail(req, res, next) {
        const retBody = {
            success: {
                resultCode: "200",
                resultMsg: "이메일 찾기 성공",
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
                    resultCode: "404",
                    resultMsg: "존재하지 않는 회원",
                    item: {},
                },
                serverError: {
                    resultCode: "500",
                    resultMsg: "서버 오류",
                    item: {},  
                },
            },
        };

        const name = req.body.name;
        const birthDate = req.body.birthDate;

        console.log(name, birthDate);

        try {
            const emailList = await findService.findEmail(name, birthDate);
            retBody.success.item.emailList = emailList;
            res.status(200).json(retBody.success);
        } catch(error) {
            if(error instanceof InvalidParamsError)
                res.status(400).json(retBody.fail.invalidParams);

            else if(error instanceof MissingRequiredParamsError)
                res.status(400).json(retBody.fail.missingRequiredParams);

            else if(error instanceof NotExistUserError)
                res.status(404).json(retBody.fail.notExistUser);

            else if(error instanceof DBError)
                res.status(500).json(retBody.fail.serverError);
        }
    },

    async findPassword(req, res, next) {
        const retBody = {
            success: {
                resultCode: "200",
                resultMsg: "임시 비밀번호 전송 성공",
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
                InconsistAnswer: {
                    resultCode: "400",
                    resultMsg: "정확하지 않은 답변",
                    item: {},
                },
                notExistUser: {
                    resultCode: "404",
                    resultMsg: "존재하지 않는 회원",
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
        const qid = req.body.qid;
        const answer = req.body.answer;

        try {
            await findService.findPassword(email, qid, answer);
            res.status(200).json(retBody.success);
        } catch(error) {
            if(error instanceof InvalidParamsError)
                res.status(400).json(retBody.fail.invalidParams);

            else if(error instanceof MissingRequiredParamsError)
                res.status(400).json(retBody.fail.missingRequiredParams);

            else if(error instanceof InconsistAnswerError)
                res.status(400).json(retBody.fail.InconsistAnswer);

            else if(error instanceof NotExistUserError)
                res.status(404).json(retBody.fail.notExistUser);

            else if(error instanceof DBError)
                res.status(500).json(retBody.fail.serverError);
        }
    },
}