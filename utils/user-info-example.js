module.exports = {
    // Good Examples
    TEST_UID                            : 1,
    TEST_EMAIL                          : "todory2002@naver.com",
    TEST_PASSWORD                       : "testpassword12!!",
    TEST_NAME                           : "홍길동",
    TEST_BIRTH_DATE                     : "19961231",
    TEST_OFF_VALID                      : 0,
    TEST_ON_VALID                       : 1,
    TEST_NORMAL_TYPE                    : 0,
    TEST_KAKAO_TYPE                     : 1,
    TEST_NAVER_TYPE                     : 2,
    TEST_GOOGLE_TYPE                    : 3,
    TEST_QID                            : 2,
    TEST_ANSWER                         : "테스트 답변",
    TEST_VERIFICATION_CODE              : "AbD+=/",
    TEST_CID                            : 1,

    // Wrong Email Examples
    SHORT_FORWARD_EMAIL                 : "@naver.com",
    SHORT_BACKWARD_EMAIL                : "todory2002@",
    NO_DOT_EMAIL                        : "todory2002@navercom",
    NO_AT_EMAIL                         : "todory2002naver.com",

    // Wrong Password Examples
    LESS_THAN_8_LEN_PASSWORD            : "aaaa12!",
    NO_ALPHA_PASSWORD                   : "1231231!!",
    NO_DIGIT_PASSWORD                   : "testpassword!!",
    NO_SPECIAL_PASSWORD                 : "testpassword12",

    // Wrong Name Examples
    LESS_THAN_2_LEN_NAME                : "김",
    GREATER_THAN_6_NAME                 : "김수한무거북이",
    INCLUDE_ALPHA_NAME                  : "홍길a동",

    // Wrong Birth Date Examples
    LESS_THAN_8_LEN_BIRTH_DATE          : "1996123",
    GREATER_THAN_8_LEN_BIRTH_DATE       : "199612312",
    IMP_BIRTH_DATE                      : "19961313",
    INCLUDE_NON_DIGIT_BIRTH_DATE        : "1996A123",

    // Wrong type Examples
    LESS_THAN_0_TYPE                    : -1,
    GREATER_THAN_3_TYPE                 : 4,

    // Wrong Valid Examples
    LESS_THAN_0_VALID                   : -1,
    GREATER_THAN_1_VALID                : 2,

    // Wrong QID Examples
    LESS_THAN_1_QID                     : 0,
    GREATER_THAN_5_QID                  : 6,

    // Wrong Answer Examples
    LESS_THAN_1_LEN_ANSWER              : "",
    GREATER_THAN_10_LEN_ANSWER          : "이것은 테스트 답변이다",

    // Wrong Code Examples
    LESS_THAN_6_LEN_VERIFICATION_CODE   : "AbD+",
    GREATER_THAN_6_LEN_VERIFICATION_CODE: "AbcDe+/",
    IMP_SPECIAL_VERIFICATION_CODE       : "AbD+!@",
}