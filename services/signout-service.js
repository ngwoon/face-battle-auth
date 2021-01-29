const { 
    DBError 
}                       = require("../utils/errors");
const { 
    DB_USER_DELETE_ERR_MSG 
}                       = require("../utils/error-messages");
const db                = require("../models");

module.exports = {
    async signOut(email, type) {
        try {
            await db.user.destroy({ where: { email, type } });
        } catch(error) {
            throw new DBError(DB_USER_DELETE_ERR_MSG, error);
        }
    }
}