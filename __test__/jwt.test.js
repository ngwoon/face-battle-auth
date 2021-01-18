
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../env/development.env")});
const jwt = require("../modules/jwt.js");


describe("middlewares/jwt.js", () => {    
    test("Check validity of created JWT", () => {
        const token = jwt.createJWT("todory2002@naver.com", "남관우", 0);
        const result = jwt.verifyJWT(token);
        expect(result).toBe(true);
    });
});