const {
    DBError
}                       = require("../utils/errors");

const signOutService    = require("../services/signout-service");

module.exports = {
    async signOut(req, res, next) {
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

        const email = res.locals.email;
        const type = res.locals.type;

        try {
            await signOutService.signOut(email, type);
            res.status(200).json(retBody.success);
        } catch(error) {
            console.log(error);
            if(error instanceof DBError)
                res.status(500).json(retBody.fail.serverError);
        } 
    },
}