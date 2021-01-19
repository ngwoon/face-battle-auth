
const { 
    InvalidParamsError, 
    DBError, 
    ExceededExpiryDateError, 
    InconsistVerificationCodeError, 
    SendEmailError, 
    NoVerificationCodeError, 
    NotExistUserError, 
    AlreadyValidUserError,
    MissingRequiredParamsError,
} = require("../utils/errors");

const { 
    TEST_UID, 
    TEST_EMAIL, 
    TEST_PASSWORD, 
    TEST_NAME, 
    TEST_BIRTH_DATE, 
    TEST_NORMAL_TYPE, 
    TEST_ON_VALID, 
    TEST_OFF_VALID,
    TEST_CID, 
    TEST_VERIFICATION_CODE, 
    DIFF_VERIFICATION_CODE,
    NO_AT_EMAIL
} = require("../utils/user-info-examples");

const { DB_USER_FIND_ERR_MSG, DB_VERIFICATION_CODE_FIND_MSG, DB_VERIFICATION_CODE_DELETE_MSG, DB_USER_UPDATE_ERR_MSG } = require("../utils/error-messages");

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../env/development.env") });

const db = require("../models");
const verificationService = require("../services/verification-service");
const nodemailer = require("nodemailer");

let TEST_EXPIRY_DATE,
    VALID_EXPIRY_DATE,
    PASSED_EXPIRY_DATE;


describe("services/verification-service.js", () => {

    afterAll(() => {
        jest.restoreAllMocks();
    });

    beforeAll(() => {
        TEST_EXPIRY_DATE = parseInt(Date.now() / 1000);
        VALID_EXPIRY_DATE = TEST_EXPIRY_DATE + 100;
        PASSED_EXPIRY_DATE = TEST_EXPIRY_DATE - 100;
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
                uid: TEST_UID,
                email: TEST_EMAIL, 
                password: TEST_PASSWORD, 
                name: TEST_NAME, 
                birth_date: TEST_BIRTH_DATE, 
                type: TEST_NORMAL_TYPE, 
                valid: TEST_ON_VALID,
            });
            
            await expect(verificationService.sendVerificationEmail(TEST_EMAIL))
            .rejects.toThrow(AlreadyValidUserError);
        });

        test("SendEmailError test", async () => {
            db.user.findOne = jest.fn().mockResolvedValue({
                uid: TEST_UID,
                email: TEST_EMAIL, 
                password: TEST_PASSWORD, 
                name: TEST_NAME, 
                birth_date: TEST_BIRTH_DATE, 
                type: TEST_NORMAL_TYPE,
                valid: TEST_OFF_VALID,
            });

            // 이전에 발급받은 인증 코드가 있는지 확인하는 함수 mock
            db.verification_code.findOne = jest.fn().mockResolvedValue(null);

            // 인증 코드 생성 후 저장하는 함수 mock
            db.verification_code.create = jest.fn().mockResolvedValue({
                uid: TEST_UID,
                cid: TEST_CID,
                code: TEST_VERIFICATION_CODE,
                expiry_date: VALID_EXPIRY_DATE,
            });
        
            // nodemailer의 sendMail 함수 mock
            jest.mock("nodemailer");
            nodemailer.createTransport = jest.fn().mockImplementation(() => {
                return {
                    sendMail() {
                        throw new Error();
                    }
                };
            });
            
            // 메일 보내기 실패 후 저장된 인증 코드 삭제 mock
            db.verification_code.destroy = jest.fn().mockResolvedValue(1);
            
            await expect(verificationService.sendVerificationEmail(TEST_EMAIL))
            .rejects.toThrow(SendEmailError);
        });

        describe("DBError test", () => {
            test("Find user test", async () => {
                db.user.findOne = jest.fn().mockImplementation(() => {
                    throw new Error();
                });
    
                await expect(verificationService.sendVerificationEmail(TEST_EMAIL))
                .rejects.toThrow(expect.objectContaining({ message: DB_USER_FIND_ERR_MSG }));
            });

            test("Find past verification code test", async () => {
                db.user.findOne = jest.fn().mockResolvedValue({
                    uid: TEST_UID,
                    email: TEST_EMAIL, 
                    password: TEST_PASSWORD, 
                    name: TEST_NAME, 
                    birth_date: TEST_BIRTH_DATE, 
                    type: TEST_NORMAL_TYPE,
                    valid: TEST_OFF_VALID,
                });
                db.verification_code.findOne = jest.fn().mockImplementation(() => {
                    throw new Error();
                });
    
                await expect(verificationService.sendVerificationEmail(TEST_EMAIL))
                .rejects.toThrow(expect.objectContaining({ message: DB_VERIFICATION_CODE_FIND_MSG }));
            });

            test("Delete past verification code test", async () => {
                db.user.findOne = jest.fn().mockResolvedValue({
                    uid: TEST_UID,
                    email: TEST_EMAIL, 
                    password: TEST_PASSWORD, 
                    name: TEST_NAME, 
                    birth_date: TEST_BIRTH_DATE, 
                    type: TEST_NORMAL_TYPE,
                    valid: TEST_OFF_VALID,
                });
                db.verification_code.findOne = jest.fn().mockResolvedValue({
                    uid: TEST_UID,
                    cid: TEST_CID,
                    code: TEST_VERIFICATION_CODE,
                    expiry_date: PASSED_EXPIRY_DATE,
                });
                db.verification_code.destroy = jest.fn().mockImplementation(() => {
                    throw new Error();
                });
    
                await expect(verificationService.sendVerificationEmail(TEST_EMAIL))
                .rejects.toThrow(expect.objectContaining({ message: DB_VERIFICATION_CODE_DELETE_MSG }));
            });

            test("Delete verification code caused by sending email fail test", async () => {
                db.user.findOne = jest.fn().mockResolvedValue({
                    uid: TEST_UID,
                    email: TEST_EMAIL, 
                    password: TEST_PASSWORD, 
                    name: TEST_NAME, 
                    birth_date: TEST_BIRTH_DATE, 
                    type: TEST_NORMAL_TYPE,
                    valid: TEST_OFF_VALID,
                });
                db.verification_code.findOne = jest.fn().mockResolvedValue(null);
                db.verification_code.create = jest.fn().mockResolvedValue({
                    uid: TEST_UID,
                    cid: TEST_CID,
                    code: TEST_VERIFICATION_CODE,
                    expiry_date: VALID_EXPIRY_DATE,
                });
                
                jest.mock("nodemailer");
                nodemailer.createTransport = jest.fn().mockImplementation(() => {
                    return {
                        sendMail() {
                            throw new Error();
                        }
                    };
                });
            
                db.verification_code.destroy = jest.fn().mockImplementation(() => {
                    throw new Error(); 
                });
    
                await expect(verificationService.sendVerificationEmail(TEST_EMAIL))
                .rejects.toThrow(expect.objectContaining({ message: DB_VERIFICATION_CODE_DELETE_MSG }));
            });
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
                uid: TEST_UID, 
                email: TEST_EMAIL,
                password: TEST_PASSWORD, 
                name: TEST_NAME, 
                birth_date: TEST_BIRTH_DATE, 
                type: TEST_NORMAL_TYPE,
                valid: TEST_OFF_VALID,
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
                uid: TEST_UID,
                email: TEST_EMAIL,
                password: TEST_PASSWORD, 
                name: TEST_NAME, 
                type: TEST_NORMAL_TYPE, 
                valid: TEST_ON_VALID,
            });
            
            await expect(verificationService.verifyEmail(TEST_EMAIL, TEST_VERIFICATION_CODE))
            .rejects.toThrow(AlreadyValidUserError);
        });

        test("InconsistVerificationCodeError test", async () => {
            db.user.findOne = jest.fn().mockResolvedValue({
                uid: TEST_UID,
                email: TEST_EMAIL,
                password: TEST_PASSWORD, 
                name: TEST_NAME, 
                type: TEST_NORMAL_TYPE, 
                valid: TEST_OFF_VALID,
            });
            
            db.verification_code.findOne = jest.fn().mockResolvedValue({
                uid: TEST_UID,
                cid: TEST_CID,
                code: DIFF_VERIFICATION_CODE, // 예상하는 인증 코드와 다른 코드
                expiry_date: TEST_EXPIRY_DATE,
            });
            
            await expect(verificationService.verifyEmail(TEST_EMAIL, TEST_VERIFICATION_CODE))
            .rejects.toThrow(InconsistVerificationCodeError);
        });

        test("ExceededExpiryDateError test", async () => {
            db.user.findOne = jest.fn().mockResolvedValue({
                uid: TEST_UID,
                email: TEST_EMAIL,
                password: TEST_PASSWORD, 
                name: TEST_NAME, 
                type: TEST_NORMAL_TYPE, 
                valid: TEST_OFF_VALID,
            });

            db.verification_code.findOne = jest.fn().mockResolvedValue({
                uid: TEST_UID,
                cid: TEST_CID,
                code: TEST_VERIFICATION_CODE, // 예상하는 인증 코드와 다른 코드
                expiry_date: PASSED_EXPIRY_DATE,
            });
            
            await expect(verificationService.verifyEmail(TEST_EMAIL, TEST_VERIFICATION_CODE))
            .rejects.toThrow(ExceededExpiryDateError);
        });



        describe("DBError test", () => {
            test("Find user test", async () => {
                // user db error
                db.user.findOne = jest.fn().mockImplementation(() => {
                    throw new Error();
                });
    
                await expect(verificationService.verifyEmail(TEST_EMAIL, TEST_VERIFICATION_CODE))
                .rejects.toThrow(expect.objectContaining({ message: DB_USER_FIND_ERR_MSG }));
            });

            test("Find verification code test", async () => {
                // verification_code db error
                db.user.findOne = jest.fn().mockResolvedValue({
                    uid: TEST_UID,
                    email: TEST_EMAIL,
                    password: TEST_PASSWORD, 
                    name: TEST_NAME, 
                    birth_date: TEST_BIRTH_DATE, 
                    type: TEST_NORMAL_TYPE, 
                    valid: TEST_OFF_VALID,
                });
                db.verification_code.findOne = jest.fn().mockImplementation(() => {
                    throw new Error();
                });
    
                await expect(verificationService.verifyEmail(TEST_EMAIL, TEST_VERIFICATION_CODE))
                .rejects.toThrow(expect.objectContaining({ message: DB_VERIFICATION_CODE_FIND_MSG }));
            });

            test("Update user valid and Delete verified code test", async () => {
                db.user.findOne = jest.fn().mockResolvedValue({
                    uid: TEST_UID,
                    email: TEST_EMAIL,
                    password: TEST_PASSWORD, 
                    name: TEST_NAME, 
                    birth_date: TEST_BIRTH_DATE, 
                    type: TEST_NORMAL_TYPE, 
                    valid: TEST_OFF_VALID,
                });
                db.verification_code.findOne = jest.fn().mockResolvedValue({
                    cid: TEST_CID,
                    uid: TEST_UID,
                    code: TEST_VERIFICATION_CODE,
                    expiry_date: VALID_EXPIRY_DATE,
                });
                db.sequelize.transaction = jest.fn().mockImplementation(() => {
                    throw new Error();
                });
    
                await expect(verificationService.verifyEmail(TEST_EMAIL, TEST_VERIFICATION_CODE))
                .rejects.toThrow(expect.objectContaining({ message: `${DB_USER_UPDATE_ERR_MSG}\n${DB_VERIFICATION_CODE_DELETE_MSG}` }));
            });
        });
    });
});