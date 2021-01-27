
/*
    Common Errors
*/
class MissingRequiredParamsError extends Error {
    constructor(...params) {
        super(...params);

        if (Error.captureStackTrace)
            Error.captureStackTrace(this, MissingRequiredParamsError);

        this.message = "필수 파라미터 누락";
    }
}
class InvalidParamsError extends Error {
    constructor(...params) {
        super(...params);

        if (Error.captureStackTrace)
            Error.captureStackTrace(this, InvalidParamsError);

        this.message = "유효하지 않은 매개변수";
    }
}
class DBError extends Error {
    constructor(message, ...params) {
        super(...params);

        if (Error.captureStackTrace)
            Error.captureStackTrace(this, DBError);

        this.message = message;
    }
}



/*
    verificationService - verifyEmail Errors
*/
class ExceededExpiryDateError extends Error {
    constructor(...params) {
        super(...params);

        if (Error.captureStackTrace)
            Error.captureStackTrace(this, ExceededExpiryDateError);

        this.message = "인증 코드 만료 기간이 지남";
    }
}
class InconsistVerificationCodeError extends Error {
    constructor(...params) {
        super(...params);

        if (Error.captureStackTrace)
            Error.captureStackTrace(this, InconsistVerificationCodeError);

        this.message = "인증 코드가 일치하지 않음";
    }
}
class NoVerificationCodeError extends Error {
    constructor(...params) {
        super(...params);

        if (Error.captureStackTrace)
            Error.captureStackTrace(this, NoVerificationCodeError);

        this.message = "인증 코드를 발급받지 않음";
    }
}



/*
    verificationService - sendVerificationEmail Errors
*/
class SendEmailError extends Error {
    constructor(...params) {
        super(...params);

        if (Error.captureStackTrace)
            Error.captureStackTrace(this, SendEmailError);

        this.message = "인증코드 이메일 전송 실패";
    }
}
class AlreadyValidUserError extends Error {
    constructor(...params) {
        super(...params);

        if (Error.captureStackTrace)
            Error.captureStackTrace(this, AlreadyValidUserError);

        this.message = "이미 활성화된 회원";
    }
}

/*
    verificationService - verifyPassword Errors
*/
class InconsistPasswordError extends Error {
    constructor(...params) {
        super(...params);

        if (Error.captureStackTrace)
            Error.captureStackTrace(this, InconsistPasswordError);

        this.message = "비밀번호 일치하지 않음";
    }
}


/*
    registrationService - checkEmailDuplication Errors
*/
class DuplicatedEmailError extends Error {
    constructor(...params) {
        super(...params);

        if (Error.captureStackTrace)
            Error.captureStackTrace(this, DuplicatedEmailError);

        this.message = "중복되는 이메일 존재";
    }
}

/*
    registrationService - registrateUser Errors
*/
class AlreadyExistUserError extends Error {
    constructor(...params) {
        super(...params);

        if (Error.captureStackTrace)
            Error.captureStackTrace(this, AlreadyExistUserError);

        this.message = "이미 존재하는 회원";
    }
}



/*
    authService - normalLogin Errors

    NotExistUserError also used in verificationService - sendVerificationEmail
*/
class NotExistUserError extends Error {
    constructor(...params) {
        super(...params);

        if (Error.captureStackTrace)
            Error.captureStackTrace(this, NotExistUserError);

        this.message = "존재하지 않는 회원";
    }
}
class NotValidUserError extends Error {
    constructor(...params) {
        super(...params);

        if (Error.captureStackTrace)
            Error.captureStackTrace(this, NotValidUserError);

        this.message = "인증되지 않은 회원";
    }
}


/*
    authService - socialLogin Errors
*/
class InvalidAccessTokenError extends Error {
    constructor(...params) {
        super(...params);

        if (Error.captureStackTrace)
            Error.captureStackTrace(this, InvalidAccessTokenError);

        this.message = "유효하지 않은 접근 토큰";
    }
}
class AxiosError extends Error {
    constructor(...params) {
        super(...params);

        if (Error.captureStackTrace)
            Error.captureStackTrace(this, AxiosError);

        this.message = "소셜 플랫폼 비동기 통신 오류";
    }
}


/*
    findService - findPassword Errors
*/
class InconsistAnswerError extends Error {
    constructor(...params) {
        super(...params);

        if (Error.captureStackTrace)
            Error.captureStackTrace(this, InconsistAnswerError);

        this.message = "정확하지 않은 답변";
    }
}




module.exports = {
    InvalidParamsError,
    MissingRequiredParamsError,
    DBError,

    ExceededExpiryDateError,
    NoVerificationCodeError,
    InconsistVerificationCodeError,

    SendEmailError,
    AlreadyValidUserError,
    
    InconsistPasswordError,
    
    DuplicatedEmailError,

    AlreadyExistUserError,

    NotExistUserError,
    NotValidUserError,

    InvalidAccessTokenError,
    AxiosError,

    InconsistAnswerError,
};