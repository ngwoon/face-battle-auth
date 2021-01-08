const jwt = require("jsonwebtoken");

const EXPIRE_TERM = 10;
const SECRET = "test";

module.exports = {
    createJWT: (email, name, type) => {
        const payload = {
            email,
            name,
            type,
        };
        const secret = SECRET;
        const options = {
            expiresIn: EXPIRE_TERM,
        };
        return jwt.sign(payload, secret, options);
    },
    verifyJWT: (token) => {

        let isValid;

        try {

            jwt.verify(token, SECRET);
            isValid = true;

        } catch(error) {
            
            if(error.name === "TokenExpiredError")
                console.log("JWT 만료");

            else if(error.name === "JsonWebTokenError")
                console.log(error.message);

            else if(error.name === "NotBeforeError")
                console.log("nbf 오류");

            isValid = false;
            
        } finally {
            return isValid;
        }
    },
};

