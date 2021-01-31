const { 
    InvalidParamsError,
    MissingRequiredParamsError,
    DBError,
}                           = require("../utils/errors");
const modificationService   = require("../services/modification-service");

module.exports = {
    async modifyPassword(req, res, next) {
        const retBody = {
            success: {
                resultCode: "200",
                resultMsg: "비밀번호 변경 성공",
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
                serverError: {
                    resultCode: "500",
                    resultMsg: "서버 오류",
                    item: {},  
                },
            },
        }
        


        try {
            const newPassword   = req.body.password;
            const email         = res.locals.email;
            const type          = res.locals.type;
            await modificationService.modifyPassword(email, newPassword, type);
            res.status(200).json(retBody.success);
        } catch(error) {
            console.log(error);

            if(error instanceof InvalidParamsError)
                next(retBody.fail.invalidParams);

            else if(error instanceof MissingRequiredParamsError)
                next(retBody.fail.missingRequiredParams);

            else if(error instanceof DBError)
                next(retBody.fail.serverError);
        }
    }
}