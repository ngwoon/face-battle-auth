const {
    InvalidParamsError, 
    MissingRequiredParamsError,
    NotExistUserError,
    InconsistAnswerError,
    SendEmailError,
    DBError,
}                   = require("../utils/errors");

const { 
    TEST_NAME,    
    TEST_BIRTH_DATE,
    TEST_QID,
    TEST_ANSWER, 
    NO_AT_EMAIL,
    LESS_THAN_2_LEN_NAME,
    TEST_UID,
    TEST_EMAIL,
    TEST_PASSWORD,
    TEST_ON_VALID,
    TEST_NORMAL_TYPE,
}                   = require("../utils/user-info-examples");

const { 
    DB_USER_FIND_ERR_MSG, DB_USER_QUESTION_FIND_ERR_MSG, DB_USER_UPDATE_ERR_MSG 
}                   = require("../utils/error-messages");

const db            = require("../models");
const findService   = require("../services/find-service");
const mail  = require("../modules/mail");


describe("services/find-service.js test", () => {
    afterAll(() => {
        jest.restoreAllMocks();
    });

    describe("findEmail function test", () => {
        test("InvalidParamsError test", async () => {            
            await expect(findService.findEmail(LESS_THAN_2_LEN_NAME, TEST_BIRTH_DATE))
            .rejects.toThrow(InvalidParamsError);
        });

        test("MissingRequiredParamsError test", async () => {            
            await expect(findService.findEmail(undefined, TEST_BIRTH_DATE))
            .rejects.toThrow(MissingRequiredParamsError);
        });

        test("NotExistUserError test", async () => {
            db.user.findAll = jest.fn().mockResolvedValue([]);

            await expect(findService.findEmail(TEST_NAME, TEST_BIRTH_DATE))
            .rejects.toThrow(NotExistUserError);
        });

        describe("DBError test", () => {
            test("Find user list test", async () => {
                db.user.findAll = jest.fn().mockImplementation(() => {
                    throw new Error();
                });
                await expect(findService.findEmail(TEST_NAME, TEST_BIRTH_DATE))
                .rejects.toThrow(expect.objectContaining({ message: DB_USER_FIND_ERR_MSG }));
            });
        });
    });


    describe("findPassword function test", () => {
        test("InvalidParamsError test", async () => {            
            await expect(findService.findPassword(NO_AT_EMAIL, TEST_QID, TEST_ANSWER))
            .rejects.toThrow(InvalidParamsError);
        });

        test("MissingRequiredParamsError test", async () => {            
            await expect(findService.findPassword(undefined, TEST_QID, TEST_ANSWER))
            .rejects.toThrow(MissingRequiredParamsError);
        });

        test("NotExistUserError test", async () => {
            db.user.findOne = jest.fn().mockResolvedValue(null);

            await expect(findService.findPassword(TEST_EMAIL, TEST_QID, TEST_ANSWER))
            .rejects.toThrow(NotExistUserError);
        });

        test("InconsistAnswerError test", async () => {
            db.user.findOne = jest.fn().mockResolvedValue({
                uid: TEST_UID,
                email: TEST_EMAIL,
                password: TEST_PASSWORD,
                name: TEST_NAME,
                birth_date: TEST_BIRTH_DATE,
                type: TEST_NORMAL_TYPE,
                valid: TEST_ON_VALID,
            });
            db.user_question.findOne = jest.fn().mockResolvedValue(null);

            await expect(findService.findPassword(TEST_EMAIL, TEST_QID, TEST_ANSWER))
            .rejects.toThrow(InconsistAnswerError);
        });

        test("SendEmailError test", async () => {
            db.user.findOne = jest.fn().mockResolvedValue({
                uid: TEST_UID,
                email: TEST_EMAIL,
                password: TEST_PASSWORD,
                name: TEST_NAME,
                birth_date: TEST_BIRTH_DATE,
                type: TEST_NORMAL_TYPE,
                valid: TEST_ON_VALID,
            });
            db.user_question.findOne = jest.fn().mockResolvedValue({
                uid: TEST_UID,
                qid: TEST_QID,
                answer: TEST_ANSWER,
            });
            db.sequelize.transaction = jest.fn().mockImplementation(async () => {
                await db.user.update();
                await mail.sendMail();
            });
            db.user.update = jest.fn().mockResolvedValue(1);
            mail.sendMail = jest.fn().mockImplementation(() => {
                throw new SendEmailError();
            });

            await expect(findService.findPassword(TEST_EMAIL, TEST_QID, TEST_ANSWER))
            .rejects.toThrow(SendEmailError);
        });

        describe("DBError test", () => {
            test("Find user test", async () => {
                db.user.findOne = jest.fn().mockImplementation(() => {
                    throw new Error();
                });

                await expect(findService.findPassword(TEST_EMAIL, TEST_QID, TEST_ANSWER))
                .rejects.toThrow(expect.objectContaining({ message: DB_USER_FIND_ERR_MSG }));
            });

            test("Find user_question test", async () => {
                db.user.findOne = jest.fn().mockResolvedValue({
                    uid: TEST_UID,
                    email: TEST_EMAIL,
                    password: TEST_PASSWORD,
                    name: TEST_NAME,
                    birth_date: TEST_BIRTH_DATE,
                    type: TEST_NORMAL_TYPE,
                    valid: TEST_ON_VALID,
                });
                db.user_question.findOne = jest.fn().mockImplementation(() => {
                    throw new Error();
                }); 

                await expect(findService.findPassword(TEST_EMAIL, TEST_QID, TEST_ANSWER))
                .rejects.toThrow(expect.objectContaining({ message: DB_USER_QUESTION_FIND_ERR_MSG }));
            });

            test("Update user test", async () => {
                db.user.findOne = jest.fn().mockResolvedValue({
                    uid: TEST_UID,
                    email: TEST_EMAIL,
                    password: TEST_PASSWORD,
                    name: TEST_NAME,
                    birth_date: TEST_BIRTH_DATE,
                    type: TEST_NORMAL_TYPE,
                    valid: TEST_ON_VALID,
                });
                db.user_question.findOne = jest.fn().mockResolvedValue({
                    uid: TEST_UID,
                    qid: TEST_QID,
                    answer: TEST_ANSWER,
                });
                db.sequelize.transaction = jest.fn().mockImplementation(async () => {
                    await db.user.update();
                    await mail.sendMail();
                });
                db.user.update = jest.fn().mockImplementation(() => {
                    throw new DBError();
                });

                await expect(findService.findPassword(TEST_EMAIL, TEST_QID, TEST_ANSWER))
                .rejects.toThrow(expect.objectContaining({ message: DB_USER_UPDATE_ERR_MSG }));
            });
        });
    });
});