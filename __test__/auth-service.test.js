const { 
    MissingRequiredParamsError, 
    InvalidParamsError, 
    NotExistUserError, 
    NotValidUserError,
    InvalidAccessTokenError,
    AxiosError,
}                   = require("../utils/errors");
const {
    TEST_UID,
    TEST_EMAIL,
    TEST_PASSWORD,
    TEST_NAME,
    TEST_BIRTH_DATE,
    TEST_NORMAL_TYPE,
    TEST_OFF_VALID,
    TEST_KAKAO_TYPE,
    TEST_EXPIRES_IN,

    NO_AT_EMAIL,
    TEST_ACCESS_TOKEN,
    GREATER_THAN_3_TYPE,
}                   = require("../utils/user-info-examples");
const { 
    DB_USER_FIND_ERR_MSG, 
    DB_USER_CREATE_ERR_MSG,
}                   = require("../utils/error-messages");
const axios         = require("axios");
const db            = require("../models");
const authService   = require("../services/auth-service");

jest.mock("axios");

describe("services/auth-service.js", () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });

    describe("NormalLogin function Test", () => {
        test("MissingRequiredParamsError test", async () => {
            await expect(authService.normalLogIn(undefined, TEST_PASSWORD))
            .rejects.toThrow(MissingRequiredParamsError);
        });

        test("InvalidParamsError test", async () => {
            await expect(authService.normalLogIn(NO_AT_EMAIL, TEST_PASSWORD))
            .rejects.toThrow(InvalidParamsError);
        });
        
        test("NotExistUserError test", async () => {
            db.user.findOne = jest.fn().mockResolvedValue(null);

            await expect(authService.normalLogIn(TEST_EMAIL, TEST_PASSWORD))
            .rejects.toThrow(NotExistUserError);
        });

        test("NotValidUserError test", async () => {
            db.user.findOne = jest.fn().mockResolvedValue({
                uid         : TEST_UID, 
                email       : TEST_EMAIL, 
                password    : TEST_PASSWORD, 
                name        : TEST_NAME, 
                birth_date  : TEST_BIRTH_DATE,
                type        : TEST_NORMAL_TYPE, 
                valid       : TEST_OFF_VALID,
            });

            await expect(authService.normalLogIn(TEST_EMAIL, TEST_PASSWORD))
            .rejects.toThrow(NotValidUserError);
        });

        describe("DBError test", () => {
            test("Find user test", async () => {
                db.user.findOne = jest.fn().mockImplementation(() => {
                    throw new Error();
                });

                await expect(authService.normalLogIn(TEST_EMAIL, TEST_PASSWORD))
                .rejects.toThrow(expect.objectContaining({ message: DB_USER_FIND_ERR_MSG }));
            });
        });
    });


    describe("SocialLogin function Test", () => {
        test("MissingRequiredParamsError test", async () => {
            await expect(authService.socialLogIn(undefined, TEST_KAKAO_TYPE, TEST_EXPIRES_IN))
            .rejects.toThrow(MissingRequiredParamsError);
        });

        test("InvalidParamsError test", async () => {
            await expect(authService.socialLogIn(TEST_ACCESS_TOKEN, GREATER_THAN_3_TYPE, TEST_EXPIRES_IN))
            .rejects.toThrow(InvalidParamsError);
        });

        test("InvalidAccessTokenError test", async () => {
            axios.get.mockImplementation(() => Promise.reject( { response: { status: 401 } }));

            await expect(authService.socialLogIn(TEST_ACCESS_TOKEN, TEST_KAKAO_TYPE, TEST_EXPIRES_IN))
            .rejects.toThrow(InvalidAccessTokenError);
        });

        test("AxiosError test", async () => {
            axios.get.mockImplementation(() => Promise.reject({}));

            await expect(authService.socialLogIn(TEST_ACCESS_TOKEN, TEST_KAKAO_TYPE, TEST_EXPIRES_IN))
            .rejects.toThrow(AxiosError);
        });

        describe("DBError test", () => {
            test("Find user test", async () => {
                axios.get.mockImplementation(() => {
                    return Promise.resolve({ 
                        response: { 
                            status: 200,
                        },
                        data: {
                            kakao_account: {
                                TEST_EMAIL,
                            },
                            properties: {
                                nickname: TEST_NAME,
                            },
                        },
                    });
                });
                db.user.findOne = jest.fn().mockImplementation(() => {
                    throw new Error();
                });

                await expect(authService.socialLogIn(TEST_ACCESS_TOKEN, TEST_KAKAO_TYPE, TEST_EXPIRES_IN))
                .rejects.toThrow(expect.objectContaining({ message: DB_USER_FIND_ERR_MSG }));
            });

            test("Create user test", async () => {
                axios.get.mockImplementation(() => {
                    return Promise.resolve({ 
                        response: { 
                            status: 200,
                        },
                        data: {
                            kakao_account: {
                                TEST_EMAIL,
                            },
                            properties: {
                                nickname: TEST_NAME,
                            },
                        },
                    });
                });
                db.user.findOne = jest.fn().mockResolvedValue(null);
                db.user.create = jest.fn().mockImplementation(() => {
                    throw new Error();
                });

                await expect(authService.socialLogIn(TEST_ACCESS_TOKEN, TEST_KAKAO_TYPE, TEST_EXPIRES_IN))
                .rejects.toThrow(expect.objectContaining({ message: DB_USER_CREATE_ERR_MSG }));
            });
        });
    });
});