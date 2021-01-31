const jwt = require("../modules/jwt");

module.exports = {
    // 권한 확인 코드
    authenticateUser(req, res, next) {
        const retBody = {
            fail: {
                unauthenticatedClient: {
                    resultCode: "400",
                    resultMsg: "토큰이 존재하지 않음",
                    item: {},
                },
                invalidToken: {
                    resultCode: "401",
                    resultMsg: "유효하지 않은 토큰",
                    item: {},
                },
            },
        };
    
        if(req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            if(token) {
                const tokenInfo = jwt.verifyJWT(token);
                if(tokenInfo.isValid) {
                    res.locals.email    = tokenInfo.payload.email;
                    res.locals.name     = tokenInfo.payload.name;
                    res.locals.type     = tokenInfo.payload.type;
                    next();
                }
                else
                    next(retBody.fail.invalidToken);
            }
        } else
            next(retBody.fail.unauthenticatedClient);
    }
}