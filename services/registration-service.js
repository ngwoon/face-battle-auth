const { InvalidParamsError, DBError, DuplicatedEmailError, MissingRequiredParamsError } = require("../utils/errors");
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
            throw new DBError("회원가입 DB 오류", error);
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
            throw new DBError("이메일 중복 확인 DB 오류", error);
        }

        // 중복된 이메일 존재 시
        if(duplicatedUser)
            throw new DuplicatedEmailError();
    },
}