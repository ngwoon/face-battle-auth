const { 
    InvalidParamsError,
    DBError, DuplicatedEmailError,
    MissingRequiredParamsError,
    AlreadyExistUserError
} = require("../utils/errors");

const { 
    DB_USER_CREATE_ERR_MSG,
    DB_USER_FIND_ERR_MSG, 
    DB_USER_QUESTION_CREATE_ERR_MSG 
} = require("../utils/error-messages");

const { verifyParams } = require("../modules/verify-params");
const crypto = require("crypto");
const db = require("../models");

module.exports = {
    async registrateUser(email, password, name, birthDate, qid, answer) {

        const verifyResult = verifyParams({email, password, name, birthDate, qid, answer});

        if(verifyResult.isParamMissed)
            throw new MissingRequiredParamsError();
        
        if(verifyResult.isParamInvalid)
            throw new InvalidParamsError();


        // 패스워드 해싱
        const hashedPassword = crypto.createHash("sha256").update(password).digest("base64");
        const type = 0;
        const valid = 0;
        let user;

        try {
            user = await db.user.findOne({ where: { email, type } , raw: true});
        } catch(error) {
            throw new DBError(DB_USER_FIND_ERR_MSG);
        }

        // 이미 존재하는 회원일 경우
        if(user)
            throw new AlreadyExistUserError();

        try {
            // 회원 정보 저장
            await db.sequelize.transaction(async (t) => {
                user = await db.user.create({
                    email,
                    name,
                    type,
                    valid,
                    password: hashedPassword,
                    birth_date: birthDate,
                });

                await db.user_question.create({
                    qid,
                    answer,
                    uid: user.uid,
                });
            });
        } catch(error) {
            throw new DBError(`${DB_USER_CREATE_ERR_MSG}\n${DB_USER_QUESTION_CREATE_ERR_MSG}`, error);
        }
    },

    async checkEmailDuplication(email) {

        const verifyResult = verifyParams({email});

        if(verifyResult.isParamMissed)
            throw new MissingRequiredParamsError();
        
        if(verifyResult.isParamInvalid)
            throw new InvalidParamsError();
        
        const type = 0;
        let duplicatedUser;

        try {
            duplicatedUser = await db.user.findOne({ where: { email, type } });
        } catch(error) {
            throw new DBError(DB_USER_FIND_ERR_MSG, error);
        }

        // 중복된 이메일 존재 시
        if(duplicatedUser)
            throw new DuplicatedEmailError();
    },
}