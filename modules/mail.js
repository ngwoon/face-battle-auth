const nodemailer            = require("nodemailer");

const ADMIN_MAIL_ADDRESS    = process.env.ADMIN_MAIL_ADDRESS;
const ADMIN_MAIL_PASSWORD   = process.env.ADMIN_MAIL_PASSWORD;

module.exports = {
    sendMail(email, subject, content) {
        return new Promise((resolve, reject) => {
            const mail = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: ADMIN_MAIL_ADDRESS,
                    pass: ADMIN_MAIL_PASSWORD,
                },
            });
    
            const mailOptions = {
                from: ADMIN_MAIL_ADDRESS,
                to  : email,
                html: content,
                subject, 
            };
    
            mail.sendMail(mailOptions, (error, info) => {
                if(error)
                    reject(error);
                else
                    resolve(info);
            });
        });  
    },
}
