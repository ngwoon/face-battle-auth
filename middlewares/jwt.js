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
    verifyJWT: (auth) => {
        const payload = jwt.verify(auth, SECRET);
        console.log("payload exp");
        console.log(payload.exp);
        console.log(Date.now()/1000);
        if(payload.exp && payload.exp > Date.now()/1000)
            return true;
        else
            return false;
    },
};

