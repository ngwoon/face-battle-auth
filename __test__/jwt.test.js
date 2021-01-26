const {
    TEST_EMAIL,
    TEST_NAME,
    TEST_NORMAL_TYPE,
} = require("../utils/user-info-examples");

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../env/development.env")});

const jwt = require("../modules/jwt");

describe("middlewares/jwt.js", () => {    
    test("Check validity of created JWT", () => {
        const token = jwt.createJWT(TEST_EMAIL, TEST_NAME, TEST_NORMAL_TYPE);
        const result = jwt.verifyJWT(token);
        expect(result.isValid).toBe(true);
        expect(result.payload).toMatchObject({
            email: TEST_EMAIL,
            name: TEST_NAME,
            type: TEST_NORMAL_TYPE,
        });
    });
});