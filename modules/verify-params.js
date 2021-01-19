const regExp = require("../utils/regexp");

module.exports = {
    verifyParams({...params}) {
        const keys = Object.keys(params);
        const values = Object.values(params);
    
        const result = {
            isParamMissed: false,
            isParamInvalid: false,
        }
    
        for(let i=0; i<values.length; ++i) {
            if(values[i] === undefined || values[i] === null) {
                result.isParamMissed = true;
                return result;
            }
        }
    
        for(let i=0; i<keys.length; ++i) {
            const isValid = regExp[keys[i]].test(values[i]);
            if(!isValid) {
                result.isParamInvalid = true;
                return result;
            }
        }

        return result;
    }
};