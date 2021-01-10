const jwt = require("jsonwebtoken");

const EXPIRE_TERM = 10;

module.exports = {
    createJWT: (email, name, type, expiresIn = EXPIRE_TERM) => {
        const payload = {
            email,
            name,
            type,
        };
        const secret = process.env.JWT_SECRET;
        const options = {
            expiresIn,
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

