
/*
    Common Errors
*/
class InvalidParamsError extends Error {
    constructor(...params) {
        super(...params);

        if (Error.captureStackTrace)
            Error.captureStackTrace(this, InvalidParamsError);

        this.message = "필수 파라미터 누락";
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




module.exports = {
    InvalidParamsError,
    DBError,

    ExceededExpiryDateError,
    NoVerificationCodeError,
    InconsistVerificationCodeError,

    SendEmailError,
    AlreadyValidUserError,
    
    DuplicatedEmailError,

    NotExistUserError,

    InvalidAccessTokenError,
};