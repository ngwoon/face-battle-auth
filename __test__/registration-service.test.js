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
} = require("../utils/user-info-example");

const db = require("../models");
const registrationService = require("../services/registration-service.js");

describe("services/registration-service.js", () => {

    afterAll(() => {
        jest.resetAllMocks();
    });

    describe("CheckEmailDuplication function test", () => {
          
        test("InvalidParamsError test", () => {            
            expect(async () => {
                await registrationService.checkEmailDuplication(NO_AT_EMAIL);
            }).rejects.toThrow(InvalidParamsError);
        });

        test("MissingRequiredParamsError test", () => {
            expect(async () => {
                await registrationService.checkEmailDuplication(undefined);
            }).rejects.toThrow(MissingRequiredParamsError);
        });

        test("DuplicatedEmailError test", () => {
            db.user.findOne = jest.fn().mockResolvedValue({
                uid: TEST_UID, 
                email: TEST_EMAIL, 
                password: TEST_PASSWORD, 
                name: TEST_NAME, 
                birth_date: TEST_BIRTH_DATE,
                type: TEST_NORMAL_TYPE, 
                valid: TEST_OFF_VALID,
            });

            expect(async () => {
                await registrationService.checkEmailDuplication(TEST_EMAIL);
            }).rejects.toThrow(DuplicatedEmailError);
        });

        test("DBError test", () => {
            db.user.findOne = jest.fn().mockImplementation(() => {
                throw new Error();
            });

            expect(async () => {
                await registrationService.checkEmailDuplication(TEST_EMAIL);
            }).rejects.toThrow(DBError);
        });

        // test("Success test", () => {
        //     db.user.findOne = jest.fn().mockResolvedValue(null);

        //     expect(async () => {
        //         await registrationService.checkEmailDuplication(TEST_EMAIL);
        //     }).not.toThrow();
        // });
    });


    describe("registrateUser function test", () => {
        
        test("InvalidParamsError test", () => {
            expect(async () => {
                await registrationService.registrateUser(NO_AT_EMAIL, TEST_PASSWORD, TEST_NAME, TEST_BIRTH_DATE, TEST_QID, TEST_ANSWER);
            }).rejects.toThrow(InvalidParamsError);
        });

        test("MissingRequiredParamsError test", () => {
            expect(async () => {
                await registrationService.registrateUser(undefined, TEST_PASSWORD, TEST_NAME, TEST_BIRTH_DATE, TEST_QID, TEST_ANSWER);
            }).rejects.toThrow(MissingRequiredParamsError);
        });

        test("AlreadyExistUserError test", () => {
            db.user.findOne = jest.fn().mockResolvedValue({
                email: TEST_EMAIL, 
                password: TEST_PASSWORD, 
                name: TEST_NAME, 
                birth_date: TEST_BIRTH_DATE, 
                type: TEST_NORMAL_TYPE, 
                valid: TEST_OFF_VALID,
            });

            expect(async () => {
                await registrationService.registrateUser(TEST_EMAIL, TEST_PASSWORD, TEST_NAME, TEST_BIRTH_DATE, TEST_QID, TEST_ANSWER);
            }).rejects.toThrow(AlreadyExistUserError);
        });

        test("DBError test", () => {
            // 유저 조회 오류
            db.user.findOne = jest.fn().mockImplementation(() => {
                throw new Error();
            });

            expect(async () => {
                await registrationService.registrateUser(TEST_EMAIL, TEST_PASSWORD, TEST_NAME, TEST_BIRTH_DATE, TEST_QID, TEST_ANSWER);
            }).rejects.toThrow(DBError);


            // 유저 생성 오류
            db.sequelize.transaction = jest.fn().mockImplementation(() => {
                throw new Error();
            });
            
            expect(async () => {
                await registrationService.registrateUser(TEST_EMAIL, TEST_PASSWORD, TEST_NAME, TEST_BIRTH_DATE, TEST_QID, TEST_ANSWER);
            }).rejects.toThrow(DBError);
        });

        // test("Success test", () => {
        //     db.user.findOne = jest.fn().mockResolvedValue(null);

        //     expect(async () => {
        //         await registrationService.registrateUser(TEST_EMAIL, TEST_PASSWORD, TEST_NAME, TEST_BIRTH_DATE, TEST_QID, TEST_ANSWER);
        //     }).not.toThrow();
        // });
    });
});