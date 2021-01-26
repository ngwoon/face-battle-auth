const {
    InvalidParamsError,
    MissingRequiredParamsError,
} = require("../utils/errors");

const {
    TEST_EMAIL,
    TEST_PASSWORD,
    TEST_NORMAL_TYPE,
    NO_AT_EMAIL
} = require("../utils/user-info-examples");

const { 
    DB_USER_UPDATE_ERR_MSG 
} = require("../utils/error-messages");

const modificationService = require("../services/modification-service");
const db = require("../models");

describe("services/modification-service.js", () => {

    afterAll(() => {
        jest.restoreAllMocks();
    });

    describe("modifyPassword function test", () => {
        test("InvalidParamsError test", async () => {            
            await expect(modificationService.modifyPassword(NO_AT_EMAIL, TEST_PASSWORD, TEST_NORMAL_TYPE))
            .rejects.toThrow(InvalidParamsError);
        });

        test("MissingRequiredParamsError test", async () => {            
            await expect(modificationService.modifyPassword(undefined, TEST_PASSWORD, TEST_NORMAL_TYPE))
            .rejects.toThrow(MissingRequiredParamsError);
        });

        describe("DBError test", () => {
            test("Update user test", async () => {
                db.user.update = jest.fn().mockImplementation(() => {
                    throw new Error();
                });

                await expect(modificationService.modifyPassword(TEST_EMAIL, TEST_PASSWORD, TEST_NORMAL_TYPE))
                .rejects.toThrow(expect.objectContaining({ message: DB_USER_UPDATE_ERR_MSG }));
            });
        });
    });
});