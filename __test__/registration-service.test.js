const { 
    InvalidParamsError, 
    DBError,
    MissingRequiredParamsError,
    DuplicatedEmailError,
    AlreadyExistUserError 
} = require("../utils/errors");

const { 
    TEST_UID,
    TEST_EMAIL,
    TEST_PASSWORD,
    TEST_NAME,
    TEST_BIRTH_DATE,
    TEST_NORMAL_TYPE,
    TEST_OFF_VALID,
    TEST_QID,
    TEST_ANSWER,
    NO_AT_EMAIL
} = require("../utils/user-info-examples");

const { DB_USER_FIND_ERR_MSG, DB_USER_CREATE_ERR_MSG, DB_USER_QUESTION_CREATE_ERR_MSG } = require("../utils/error-messages");

const db = require("../models");
const registrationService = require("../services/registration-service.js");

describe("services/registration-service.js", () => {

    afterAll(() => {
        jest.restoreAllMocks();
    });

    describe("CheckEmailDuplication function test", () => {
          
        test("InvalidParamsError test", async () => {            
            await expect(registrationService.checkEmailDuplication(NO_AT_EMAIL))
            .rejects.toThrow(InvalidParamsError);
        });

        test("MissingRequiredParamsError test", async () => {
            await expect(registrationService.checkEmailDuplication(undefined))
            .rejects.toThrow(MissingRequiredParamsError);
        });

        test("DuplicatedEmailError test", async () => {
            db.user.findOne = jest.fn().mockResolvedValue({
                uid: TEST_UID, 
                email: TEST_EMAIL, 
                password: TEST_PASSWORD, 
                name: TEST_NAME, 
                birth_date: TEST_BIRTH_DATE,
                type: TEST_NORMAL_TYPE, 
                valid: TEST_OFF_VALID,
            });

            await expect(registrationService.checkEmailDuplication(TEST_EMAIL))
            .rejects.toThrow(DuplicatedEmailError);
        });

        describe("DBError test", () => {
            test("Find user test", async () => {  
                // 이메일 조회 오류
                db.user.findOne = jest.fn().mockImplementation(() => {
                    throw new Error();
                });
    
                await expect(registrationService.checkEmailDuplication(TEST_EMAIL))
                .rejects.toThrow(expect.objectContaining({ message: DB_USER_FIND_ERR_MSG }));
            });
        });
    });


    describe("registrateUser function test", () => {
        
        test("InvalidParamsError test", async () => {
            expect(registrationService.registrateUser(NO_AT_EMAIL, TEST_PASSWORD, TEST_NAME, TEST_BIRTH_DATE, TEST_QID, TEST_ANSWER))
            .rejects.toThrow(InvalidParamsError);
        });

        test("MissingRequiredParamsError test", async () => {
            expect(registrationService.registrateUser(undefined, TEST_PASSWORD, TEST_NAME, TEST_BIRTH_DATE, TEST_QID, TEST_ANSWER))
            .rejects.toThrow(MissingRequiredParamsError);
        });

        test("AlreadyExistUserError test", async () => {
            db.user.findOne = jest.fn().mockResolvedValue({
                email: TEST_EMAIL, 
                password: TEST_PASSWORD, 
                name: TEST_NAME, 
                birth_date: TEST_BIRTH_DATE, 
                type: TEST_NORMAL_TYPE, 
                valid: TEST_OFF_VALID,
            });

            expect(registrationService.registrateUser(TEST_EMAIL, TEST_PASSWORD, TEST_NAME, TEST_BIRTH_DATE, TEST_QID, TEST_ANSWER))
            .rejects.toThrow(AlreadyExistUserError);
        });

        describe("DBError test", () => {
            test("Find user test", async () => {
                // 유저 조회 오류
                db.user.findOne = jest.fn().mockImplementation(() => {
                    throw new Error();
                });
    
                expect(registrationService.registrateUser(TEST_EMAIL, TEST_PASSWORD, TEST_NAME, TEST_BIRTH_DATE, TEST_QID, TEST_ANSWER))
                .rejects.toThrow(expect.objectContaining({ message: DB_USER_FIND_ERR_MSG }));
            });

            test("Create user test", async () => {
                db.user.findOne = jest.fn().mockResolvedValue(null);
                db.sequelize.transaction = jest.fn().mockImplementation(() => {
                    throw new Error();
                });
                
                expect(registrationService.registrateUser(TEST_EMAIL, TEST_PASSWORD, TEST_NAME, TEST_BIRTH_DATE, TEST_QID, TEST_ANSWER))
                .rejects.toThrow(expect.objectContaining({ message: `${DB_USER_CREATE_ERR_MSG}\n${DB_USER_QUESTION_CREATE_ERR_MSG}` }));
            });
        });
    });
});