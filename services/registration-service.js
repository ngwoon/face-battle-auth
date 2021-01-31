const { 
    InvalidParamsError,
    DBError, DuplicatedEmailError,
    MissingRequiredParamsError,
    AlreadyExistUserError
}                       = require("../utils/errors");
const { 
    DB_USER_CREATE_ERR_MSG,
    DB_USER_FIND_ERR_MSG, 
    DB_USER_QUESTION_CREATE_ERR_MSG 
}                       = require("../utils/error-messages");
const { verifyParams }  = require("../modules/verify-params");
const db                = require("../models");
const crypto            = require("crypto");

module.exports = {
    async registrateUser(email, password, name, birthDate, qid, answer) {

        const verifyResult = verifyParams({email, password, name, birthDate, qid, answer});
        if(verifyResult.isParamMissed)
            throw new MissingRequiredParamsError();
        
        if(verifyResult.isParamInvalid)
            throw new InvalidParamsError();



        const hashedPassword = crypto.createHash("sha256").update(password).digest("base64");
        const type = 0;
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
            const valid = 0;    // 이메일 인증을 받아야 하는 회원이므로 valid를 0으로
            await db.sequelize.transaction(async (t) => {
                user = await db.user.create({
                    email,
                    name,
                    type,
                    valid,
                    password: hashedPassword,
                    birth_date: birthDate,
                }, { transaction: t });

                await db.user_question.create({
                    qid,
                    answer,
                    uid: user.uid,
                }, { transaction: t });
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