const { 
    MissingRequiredParamsError,
    InvalidParamsError,
    DBError,
}                       = require("../utils/errors");
const { 
    DB_USER_UPDATE_ERR_MSG 
}                       = require("../utils/error-messages");
const { verifyParams }  = require("../modules/verify-params");
const db                = require("../models");
const crypto            = require("crypto");


module.exports = {
    async modifyPassword(email, newPassword, type) {
        const verifyResult = verifyParams({email, password: newPassword, type});

        if(verifyResult.isParamMissed)
            throw new MissingRequiredParamsError();
        
        if(verifyResult.isParamInvalid)
            throw new InvalidParamsError();

        

        const hashedNewPassword = crypto.createHash("sha256").update(newPassword).digest("base64");
        try {
            await db.user.update({ password: hashedNewPassword }, { where: { email, type } });
        } catch(error) {
            throw new DBError(DB_USER_UPDATE_ERR_MSG, error);
        }
    },
}