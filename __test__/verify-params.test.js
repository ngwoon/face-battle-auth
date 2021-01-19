const {
    TEST_EMAIL,
    TEST_PASSWORD,
    TEST_NAME,
    TEST_BIRTH_DATE,
    TEST_NORMAL_TYPE,
    TEST_QID,
    TEST_ANSWER,
    TEST_VERIFICATION_CODE,

    SHORT_FORWARD_EMAIL,
    SHORT_BACKWARD_EMAIL,             
    NO_DOT_EMAIL,                     
    NO_AT_EMAIL,         

    LESS_THAN_8_LEN_PASSWORD,         
    NO_ALPHA_PASSWORD,              
    NO_DIGIT_PASSWORD,                   
    NO_SPECIAL_PASSWORD,            

    LESS_THAN_2_LEN_NAME,  
    GREATER_THAN_6_NAME,             
    INCLUDE_ALPHA_NAME, 

    LESS_THAN_8_LEN_BIRTH_DATE,     
    GREATER_THAN_8_LEN_BIRTH_DATE,      
    IMP_BIRTH_DATE,                     
    INCLUDE_NON_DIGIT_BIRTH_DATE,     
    
    LESS_THAN_0_TYPE,
    GREATER_THAN_3_TYPE,

    LESS_THAN_1_QID,                  
    GREATER_THAN_5_QID,                 

    LESS_THAN_1_LEN_ANSWER,           
    GREATER_THAN_10_LEN_ANSWER,
    
    LESS_THAN_6_LEN_VERIFICATION_CODE,
    GREATER_THAN_6_LEN_VERIFICATION_CODE,
    IMP_SPECIAL_VERIFICATION_CODE,
} = require("../utils/user-info-example");
const { verifyParams } = require("../modules/verify-params");


describe("modules/verify-params.js", () => {

    let params;
    beforeAll(() => {
        params = {
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
            name: TEST_NAME,
            birth_date: TEST_BIRTH_DATE,
            type: TEST_NORMAL_TYPE,
            qid: TEST_QID,
            answer: TEST_ANSWER,
            code: TEST_VERIFICATION_CODE,
        }
    });

    describe("Invalid Param Test", () => {
        describe("Wrong Email Test", () => {
            test("Short forward length test", () => {
                params.email = SHORT_FORWARD_EMAIL;
                const result = verifyParams(params);
                expect(result.isParamMissed).toBe(false);
                expect(result.isParamInvalid).toBe(true);
            });
    
            test("Short backward length test", () => {
                params.email = SHORT_BACKWARD_EMAIL;
                const result = verifyParams(params);
                expect(result.isParamMissed).toBe(false);
                expect(result.isParamInvalid).toBe(true);
            });
    
            test("No . test", () => {
                params.email = NO_DOT_EMAIL;
                const result = verifyParams(params);
                expect(result.isParamMissed).toBe(false);
                expect(result.isParamInvalid).toBe(true);
            });
    
            test("No @ test", () => {
                params.email = NO_AT_EMAIL;
                const result = verifyParams(params);
                expect(result.isParamMissed).toBe(false);
                expect(result.isParamInvalid).toBe(true);
            });
        });
    
        describe("Wrong Password Test", () => {
            test("Less than length 8 test", () => {
                params.password = LESS_THAN_8_LEN_PASSWORD;
                const result = verifyParams(params);
                expect(result.isParamMissed).toBe(false);
                expect(result.isParamInvalid).toBe(true);
            });
    
            test("No alphabet test", () => {
                params.password = NO_ALPHA_PASSWORD;
                const result = verifyParams(params);
                expect(result.isParamMissed).toBe(false);
                expect(result.isParamInvalid).toBe(true);
            });
    
            test("No digit test", () => {
                params.password = NO_DIGIT_PASSWORD;
                const result = verifyParams(params);
                expect(result.isParamMissed).toBe(false);
                expect(result.isParamInvalid).toBe(true);
            });
    
            test("No special char test", () => {
                params.password = NO_SPECIAL_PASSWORD;
                const result = verifyParams(params);
                expect(result.isParamMissed).toBe(false);
                expect(result.isParamInvalid).toBe(true);
            });
        });
    
        describe("Wrong Name Test", () => {
            test("Less than length 2 test", () => {
                params.name = LESS_THAN_2_LEN_NAME;
                const result = verifyParams(params);
                expect(result.isParamMissed).toBe(false);
                expect(result.isParamInvalid).toBe(true);
            });
    
            test("Greater than length 6 test", () => {
                params.name = GREATER_THAN_6_NAME;
                const result = verifyParams(params);
                expect(result.isParamMissed).toBe(false);
                expect(result.isParamInvalid).toBe(true);
            });
    
            test("Include alphabet test", () => {
                params.name = INCLUDE_ALPHA_NAME;
                const result = verifyParams(params);
                expect(result.isParamMissed).toBe(false);
                expect(result.isParamInvalid).toBe(true);
            });
        });
    
        describe("Wrong BirthDate Test", () => {
            test("Less than length 8 test", () => {
                params.birth_date = LESS_THAN_8_LEN_BIRTH_DATE;
                const result = verifyParams(params);
                expect(result.isParamMissed).toBe(false);
                expect(result.isParamInvalid).toBe(true);
            });
    
            test("Greater than length 8 test", () => {
                params.birth_date = GREATER_THAN_8_LEN_BIRTH_DATE;
                const result = verifyParams(params);
                expect(result.isParamMissed).toBe(false);
                expect(result.isParamInvalid).toBe(true);
            });
    
            test("Impossible date test", () => {
                params.birth_date = IMP_BIRTH_DATE;
                const result = verifyParams(params);
                expect(result.isParamMissed).toBe(false);
                expect(result.isParamInvalid).toBe(true);
            });
    
            test("Include non digit test", () => {
                params.birth_date = INCLUDE_NON_DIGIT_BIRTH_DATE;
                const result = verifyParams(params);
                expect(result.isParamMissed).toBe(false);
                expect(result.isParamInvalid).toBe(true);
            });
        });
    
        describe("Wrong Type Test", () => {
            test("Less than 0 test", () => {
                params.type = LESS_THAN_0_TYPE;
                const result = verifyParams(params);
                expect(result.isParamMissed).toBe(false);
                expect(result.isParamInvalid).toBe(true);
            });
    
            test("Greater than 3 test", () => {
                params.type = GREATER_THAN_3_TYPE;
                const result = verifyParams(params);
                expect(result.isParamMissed).toBe(false);
                expect(result.isParamInvalid).toBe(true);
            });
        });
    
        describe("Wrong Qid Test", () => {
            test("Less than 1 test", () => {
                params.qid = LESS_THAN_1_QID;
                const result = verifyParams(params);
                expect(result.isParamMissed).toBe(false);
                expect(result.isParamInvalid).toBe(true);
            });
    
            test("Greater than 5 test", () => {
                params.qid = GREATER_THAN_5_QID;
                const result = verifyParams(params);
                expect(result.isParamMissed).toBe(false);
                expect(result.isParamInvalid).toBe(true);
            });
        });
    
        describe("Wrong Answer Test", () => {
            test("Less than length 1 test", () => {
                params.answer = LESS_THAN_1_LEN_ANSWER;
                const result = verifyParams(params);
                expect(result.isParamMissed).toBe(false);
                expect(result.isParamInvalid).toBe(true);
            });
    
            test("Greater than length 10 test", () => {
                params.answer = GREATER_THAN_10_LEN_ANSWER;
                const result = verifyParams(params);
                expect(result.isParamMissed).toBe(false);
                expect(result.isParamInvalid).toBe(true);
            });
        });

        describe("Wrong Code Test", () => {
            test("Less than length 6 test", () => {
                params.code = LESS_THAN_6_LEN_VERIFICATION_CODE;
                const result = verifyParams(params);
                expect(result.isParamMissed).toBe(false);
                expect(result.isParamInvalid).toBe(true);
            });
    
            test("Greater than length 6 test", () => {
                params.code = GREATER_THAN_6_LEN_VERIFICATION_CODE;
                const result = verifyParams(params);
                expect(result.isParamMissed).toBe(false);
                expect(result.isParamInvalid).toBe(true);
            });

            test("Impossible special char test", () => {
                params.code = IMP_SPECIAL_VERIFICATION_CODE;
                const result = verifyParams(params);
                expect(result.isParamMissed).toBe(false);
                expect(result.isParamInvalid).toBe(true);
            });
        });
    });



    describe("Missing Param Test", () => {
        test("Missing email test", () => {
            params.email = undefined;
            const result = verifyParams(params);
            expect(result.isParamMissed).toBe(true);
            expect(result.isParamInvalid).toBe(false);
        });

        test("Missing password test", () => {
            params.password = undefined;
            const result = verifyParams(params);
            expect(result.isParamMissed).toBe(true);
            expect(result.isParamInvalid).toBe(false);
        });

        test("Missing name test", () => {
            params.name = undefined;
            const result = verifyParams(params);
            expect(result.isParamMissed).toBe(true);
            expect(result.isParamInvalid).toBe(false);
        });

        test("Missing birth date test", () => {
            params.birth_date = undefined;
            const result = verifyParams(params);
            expect(result.isParamMissed).toBe(true);
            expect(result.isParamInvalid).toBe(false);
        });

        test("Missing type test", () => {
            params.type = undefined;
            const result = verifyParams(params);
            expect(result.isParamMissed).toBe(true);
            expect(result.isParamInvalid).toBe(false);
        });

        test("Missing qid test", () => {
            params.qid = undefined;
            const result = verifyParams(params);
            expect(result.isParamMissed).toBe(true);
            expect(result.isParamInvalid).toBe(false);
        });

        test("Missing answer test", () => {
            params.answer = undefined;
            const result = verifyParams(params);
            expect(result.isParamMissed).toBe(true);
            expect(result.isParamInvalid).toBe(false);
        });

        test("Missing code test", () => {
            params.code = undefined;
            const result = verifyParams(params);
            expect(result.isParamMissed).toBe(true);
            expect(result.isParamInvalid).toBe(false);
        });
    });
});