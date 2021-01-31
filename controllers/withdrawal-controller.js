const {
    DBError
}                           = require("../utils/errors");
const withdrawalService     = require("../services/withdrawal-service");

module.exports = {
    async withdraw(req, res, next) {
        const retBody = {
            success: {
                resultCode: "200",
                resultMsg: "회원 탈퇴 성공",
                item: {},
            },
            fail: {
                serverError: {
                    resultCode: "500",
                    resultMsg: "서버 오류",
                    item: {},
                },
            },
        };

        

        try {
            const email = res.locals.email;
            const type  = res.locals.type;
            await withdrawalService.withdraw(email, type);
            res.status(200).json(retBody.success);
        } catch(error) {
            console.log(error);

            if(error instanceof DBError)
                next(retBody.fail.serverError);
        } 
    },
}