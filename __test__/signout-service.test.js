
const signOutService    = require("../services/signout-service");
const db                = require("../models");
const { 
    TEST_EMAIL,
    TEST_NORMAL_TYPE
}                       = require("../utils/user-info-examples");
const { 
    DB_USER_DELETE_ERR_MSG
}                       = require("../utils/error-messages");

describe("services/signout-service.js", () => {
    
    afterAll(() => {
        jest.restoreAllMocks();
    });
    
    describe("signOut function test", () => {
        describe("DBError test", () => {
            test("Delete user test", async () => {
                db.user.destroy = jest.fn().mockImplementation(() => {
                    throw new Error();
                });

                await expect(signOutService.signOut(TEST_EMAIL, TEST_NORMAL_TYPE))
                .rejects.toThrow(expect.objectContaining({ message: DB_USER_DELETE_ERR_MSG }));
            });
        });
    });
});