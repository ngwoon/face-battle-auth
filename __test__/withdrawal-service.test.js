
const { 
    TEST_EMAIL,
    TEST_NORMAL_TYPE
}                           = require("../utils/user-info-examples");
const { 
    DB_USER_DELETE_ERR_MSG
}                           = require("../utils/error-messages");
const withdrawalService     = require("../services/withdrawal-service");
const db                    = require("../models");

describe("services/withdrawal-service.js", () => {
    afterAll(() => {
        jest.restoreAllMocks();
    });
    
    describe("signOut function test", () => {
        describe("DBError test", () => {
            test("Delete user test", async () => {
                db.user.destroy = jest.fn().mockImplementation(() => {
                    throw new Error();
                });

                await expect(withdrawalService.withdraw(TEST_EMAIL, TEST_NORMAL_TYPE))
                .rejects.toThrow(expect.objectContaining({ message: DB_USER_DELETE_ERR_MSG }));
            });
        });
    });
});