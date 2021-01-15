const nodemailer = require("nodemailer");
const crypto = require("crypto");
const db = require("../models");
const jwt = require("../modules/jwt");
const { InvalidParamsError, DBError, ExceededExpiryDateError, InconsistVerificationCodeError, SendEmailError, NoVerificationCodeError, NotExistUserError, AlreadyValidUserError } = require("../errors");


const VERIFICATION_EXPIRY_PERIOD = 300;
const HASH_STRING = process.env.HASH_STRING;
const ADMIN_MAIL_ADDRESS = process.env.ADMIN_MAIL_ADDRESS;
const ADMIN_MAIL_PASSWORD = process.env.ADMIN_MAIL_PASSWORD;
const MAIL_SUBJECT = "[no-reply] Face Battle 앱의 인증코드";
const MAIL_CONTENT = "Face Battle 앱에 회원이 된 것을 축하드립니다!\n \
                    이메일 인증을 위해 아래 코드를 입력해 주세요.\n \
                    <h2>";


module.exports = {
    async verifyEmail(email, code) {

        if(!(email && code))
            throw new InvalidParamsError();

        let currentUser, verificationCodeRow;
        const type = 0;
        
        // 회원, 해당 회원의 인증 코드 조회
        try {
            currentUser = await db.user.findOne({ where: { email, type }, raw: true });
        } catch(error) {
            throw new DBError("회원 조회 오류", error);
        }

        // 존재하지 않는 회원일 경우
        if(!currentUser)
            throw new NotExistUserError();
        
        try {
            verificationCodeRow = await db.verification_code.findOne({ where: { uid: currentUser.uid } });
        } catch(error) {
            throw new DBError("인증 코드 조회 오류", error);
        }
        
        if(verificationCodeRow) {
            // DB에 일치하는 인증 코드가 존재하는 경우
            if(verificationCodeRow.code === code) {
        
                const currentDate = Date.now() / 1000;
        
                // 만료 기간이 유효한 경우
                if(verificationCodeRow.expiry_date >= currentDate) {
                    try {
                        await db.sequelize.transaction(async (t) => {
                            await db.user.update({ valid: 1 }, { where : { uid: currentUser.uid }, transaction: t });
                            await db.verification_code.destroy({ where: { code: code }, transaction: t});
                        });

                        currentUser.valid = 1;
                        delete currentUser.password;

                        // JWT 토큰 생성, 반환
                        createdJWT = jwt.createJWT(email, currentUser.name, type);

                        return { jwt: createdJWT, userInfo: currentUser };
        
                    } catch(error) {
                        throw new DBError("회원 활성화, 검증된 인증 코드 폐기 오류", error);
                    }
                }
                // 만료 기간이 지난 경우
                else if(verificationCodeRow.expiry_date < currentDate)
                    throw new ExceededExpiryDateError();
            } 
        
            // DB에 일치하는 인증 코드가 없는 경우
            else
                throw new InconsistVerificationCodeError();
        } 
        
        // 인증코드를 발급받지 않은 회원일 경우
        else
            throw new NoVerificationCodeError();
    },

    async sendVerificationEmail(email) {
        
        if(!email)
            throw new InvalidParamsError();
        
        // 현재 요청을 보낸 클라이언트 정보
        let currentUser;
    
        // 새로 생성한 인증 코드
        let verificationCode;
    
        // 클라이언트 유형, uid
        const type = 0;
        let uid;
    
        try {
            // 현재 회원이 이전에 요청한 인증코드 있는지 확인
            currentUser = await db.user.findOne({ where: { email, type } });
        } catch(error) {
            throw new DBError("인증 코드 관련 DB 오류", error);
        }

        // 등록되지 않은 회원이 이메일 발송 요청을 한 경우
        if(!currentUser)
            throw new NotExistUserError();
        
        // 이미 인증한 회원이 이메일 발송 요청을 한 경우
        if(currentUser.valid)
            throw new AlreadyValidUserError();
        
        uid = currentUser.uid;
        const verificationCodeRow = await db.verification_code.findOne({ where: { uid } });
        
        // 새로운 인증코드 발급을 위해 해당 인증코드 삭제
        if(verificationCodeRow) {
            try {
                await db.verification_code.destroy({ where: { uid } });
            } catch(error) {
                throw new DBError("이전 인증코드 삭제 오류", error);
            }
        }
        
        // 인증 코드 생성
        const hashString = crypto.createHash("sha256").update(HASH_STRING).digest("base64");
        const randNum = Math.floor(Math.random() * (hashString.length - 6));
        
        verificationCode = hashString.slice(randNum, randNum + 6);

        try {
            // 인증 코드 저장
            await db.verification_code.create({
                uid,
                code: verificationCode,
                expiry_date: Date.now()/1000 + VERIFICATION_EXPIRY_PERIOD,
            }, { raw: true });
        } catch(error) {
            throw new DBError("인증 코드 저장 오류", error);
        }



        try {
            // 인증 메일 발송
            await new Promise((resolve, reject) => {

                const mail = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: ADMIN_MAIL_ADDRESS,
                        pass: ADMIN_MAIL_PASSWORD,
                    },
                });
        
                const mailOptions = {
                    from: ADMIN_MAIL_ADDRESS,
                    to: email,
                    subject: MAIL_SUBJECT,
                    html: MAIL_CONTENT + verificationCode + "</h2>",
                };

                mail.sendMail(mailOptions, (error, info) => {
                    if(error)
                        reject(error);
                    else
                        resolve(info);
                });
            });
        } catch(error) {
            let isEmailError = true;

            try {
                await db.verification_code.destroy({ where: { uid } });
            } catch(error) {
                isEmailError = false;
                throw new DBError("새로 생성한 인증코드 삭제 오류", error);
            }

            if(isEmailError)
                throw new SendEmailError(error.error);
            else
                throw new DBError("새로 생성한 인증코드 삭제 오류", error);
        }
    },
}