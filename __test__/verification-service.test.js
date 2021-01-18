
const { InvalidParamsError, DBError, ExceededExpiryDateError, InconsistVerificationCodeError, SendEmailError, NoVerificationCodeError, NotExistUserError, AlreadyValidUserError, MissingRequiredParamsError } = require("../utils/errors");
const db = require("../models");
const verificationService = require("../services/verification-service");
const { TEST_UID, TEST_EMAIL, TEST_PASSWORD, TEST_NAME, TEST_BIRTH_DATE, TEST_NORMAL_TYPE, TEST_ON_VALID, TEST_OFF_VALID,
    TEST_QID, TEST_ANSWER, TEST_VERIFICATION_CODE, TEST_CID, NO_AT_EMAIL } = require("./user-info-example");

describe("services/verification-service.js", () => {

    afterAll(() => {
        console.log("mock clear!");
        jest.resetAllMocks();
    });

    describe("SendVerificationEmail function test", () => {
        test("InvalidParamsError test", async () => {
            await expect(verificationService.sendVerificationEmail(NO_AT_EMAIL))
            .rejects.toThrow(InvalidParamsError);
        });

        test("MissingRequiredParamsError test", async () => {
            await expect(verificationService.sendVerificationEmail(undefined))
            .rejects.toThrow(MissingRequiredParamsError);
        });

        test("NotExistUserError test", async () => {
            db.user.findOne = jest.fn().mockResolvedValue(null);
            
            await expect(verificationService.sendVerificationEmail(TEST_EMAIL))
            .rejects.toThrow(NotExistUserError);
        });

        test("AlreadyValidUserError test", async () => {
            db.user.findOne = jest.fn().mockResolvedValue({
                uid: TEST_UID, email: TEST_EMAIL, password: TEST_PASSWORD, name: TEST_NAME, 
                birth_date: TEST_BIRTH_DATE, type: TEST_NORMAL_TYPE, valid: TEST_ON_VALID
            });
            
            await expect(verificationService.sendVerificationEmail(TEST_EMAIL))
            .rejects.toThrow(AlreadyValidUserError);
        });

        // test("SendEmailError test", () => {

        // });

        test("DBError test", async () => {
            db.user.findOne = jest.fn().mockImplementation(() => {
                throw new Error();
            });

            await expect(verificationService.sendVerificationEmail(TEST_EMAIL))
            .rejects.toThrow(DBError);
        });
    });


    describe("verifyEmail function test", () => {
        test("InvalidParamsError test", async () => {
            
            await expect(verificationService.sendVerificationEmail(NO_AT_EMAIL, TEST_VERIFICATION_CODE))
            .rejects.toThrow(InvalidParamsError);
        });

        test("MissingRequiredParamsError test", async () => {
            await expect(verificationService.verifyEmail(TEST_EMAIL, undefined))
            .rejects.toThrow(MissingRequiredParamsError);
        });

        test("NoVerificationCodeError test", async () => {
            db.user.findOne = jest.fn().mockResolvedValue({
                uid: TEST_UID, email: TEST_EMAIL, password: TEST_PASSWORD, name: TEST_NAME, 
                birth_date: TEST_BIRTH_DATE, type: TEST_NORMAL_TYPE, valid: TEST_OFF_VALID
            });
            db.verification_code.findOne = jest.fn().mockResolvedValue(null);
            
            await expect(verificationService.verifyEmail(TEST_EMAIL, TEST_VERIFICATION_CODE))
            .rejects.toThrow(NoVerificationCodeError);
        });

        test("NotExistUserError test", async () => {
            db.user.findOne = jest.fn().mockResolvedValue(null);
            
            await expect(verificationService.verifyEmail(TEST_EMAIL, TEST_VERIFICATION_CODE))
            .rejects.toThrow(NotExistUserError);
        });

        test("AlreadyValidUserError test", async () => {
            db.user.findOne = jest.fn().mockResolvedValue({
                uid: TEST_UID, email: TEST_EMAIL, password: TEST_PASSWORD, name: TEST_NAME, 
                type: TEST_NORMAL_TYPE, valid: TEST_ON_VALID
            });
            
            await expect(verificationService.verifyEmail(TEST_EMAIL, TEST_VERIFICATION_CODE))
            .rejects.toThrow(AlreadyValidUserError);
        });

        // TODO 만들어야됨
        test("DBError test", async () => {
            db.user.findOne = jest.fn().mockImplementation(() => {
                throw new Error();
            });

            await expect(verificationService.verifyEmail(TEST_EMAIL, TEST_VERIFICATION_CODE))
            .rejects.toThrow(DBError);
        });
    });
});