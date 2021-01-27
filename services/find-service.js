const {
    InvalidParamsError,
    MissingRequiredParamsError,
    NotExistUserError,
    InconsistAnswerError,
    DBError,
} = require("../utils/errors");

const { 
    DB_USER_FIND_ERR_MSG, 
    DB_USER_QUESTION_FIND_ERR_MSG,
    DB_USER_UPDATE_ERR_MSG,
} = require("../utils/error-messages");

const { createPassword } = require("../modules/safe-password");
const { verifyParams } = require("../modules/verify-params");
const { sendMail } = require("../modules/mail");
const db = require("../models");
const crypto = require("crypto");

const TEMP_PASSWORD_LENGTH = 10;
const TEMP_PASSWORD_MAIL_SUBJECT = "[no-reply] Face Battle 앱의 임시 비밀번호";
const TEMP_PASSWORD_MAIL_CONTENT = "Face Battle 앱의 임시 비밀번호입니다.\n \
                    로그인 후 자신의 비밀번호로 변경해주시길 바랍니다.\n \
                    <h2>";

module.exports = {
    async findEmail(name, birthDate) {
        const verifyResult = verifyParams({ name, birthDate });

        if(verifyResult.isParamMissed)
            throw new MissingRequiredParamsError();
        
        if(verifyResult.isParamInvalid)
            throw new InvalidParamsError();

        const emailList = [];
        let userList;
        try {
            userList = await db.user.findAll({ where: { name, birth_date: birthDate }, raw: true });
        } catch(error) {
            throw new DBError(DB_USER_FIND_ERR_MSG, error);
        }

        if(userList.length === 0)
            throw new NotExistUserError();
        
        for(let user of userList) {
            let splitedEmail = user.email.split("@");
            splitedEmail[0] = splitedEmail[0].slice(0, 4) + "***";
            emailList.push(splitedEmail[0] + "@" + splitedEmail[1]);
        }

        return emailList;
    },

    async findPassword(email, qid, answer) {
        const verifyResult = verifyParams({ email, qid, answer });

        if(verifyResult.isParamMissed)
            throw new MissingRequiredParamsError();
        
        if(verifyResult.isParamInvalid)
            throw new InvalidParamsError();

        // 이 API는 일반 회원에게만 허용되는 API이므로 type을 0으로 고정
        const type = 0;

        // 유저 존재 확인
        let currentUser;
        try {
            currentUser = await db.user.findOne({ email, type });
        } catch(error) {
            throw new DBError(DB_USER_FIND_ERR_MSG, error);
        }

        if(!currentUser)
            throw new NotExistUserError();

        // 유저의 질문 - 답변이 정확한지 확인
        let currentUserAnswer;
        try {
            currentUserAnswer = await db.user_question.findOne({ qid, answer });
        } catch(error) {
            throw new DBError(DB_USER_QUESTION_FIND_ERR_MSG);
        }

        if(!currentUserAnswer)
            throw new InconsistAnswerError();


        // 임시 비밀번호 생성, 교체
        const tempPassword = createPassword(TEMP_PASSWORD_LENGTH);
        const hashedPassword = crypto.createHash("sha256").update(tempPassword).digest("base64");

        try {
            await db.sequelize.transaction(async (t) => {
                await db.user.update({ password: hashedPassword }, { where: { email, type }, transaction: t });
                await sendMail(email, TEMP_PASSWORD_MAIL_SUBJECT, TEMP_PASSWORD_MAIL_CONTENT + tempPassword + "</h2>");
            });
        } catch(error) {
            throw new DBError(DB_USER_UPDATE_ERR_MSG, error);
        }
    },
}