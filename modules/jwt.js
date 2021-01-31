const jwt           = require("jsonwebtoken");

const EXPIRE_TERM   = 7199;
const SECRET        = process.env.JWT_SECRET;

module.exports = {
    createJWT: (email, name, type, expiresIn = EXPIRE_TERM) => {
        const payload = {
            email,
            name,
            type,
        };
        const secret    = SECRET;
        const options   = {
            expiresIn,
        };
        return jwt.sign(payload, secret, options);
    },
    verifyJWT: (token) => {

        const item = {
            payload: {},
            isValid: true,
        }

        try {
            item.payload = jwt.verify(token, SECRET);
        } catch(error) {
            
            if(error.name === "TokenExpiredError")
                console.log("JWT 만료");

            else if(error.name === "JsonWebTokenError")
                console.log(error.message);

            else if(error.name === "NotBeforeError")
                console.log("nbf 오류");

            item.isValid = false;

        } finally {
            return item;
        }
    },
};

