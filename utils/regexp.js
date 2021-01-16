const EMAIL_REGEXP      = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
const PASSWORD_REGEXP   = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,}$/;
const NAME_REGEXP       = /^[가-힣]{2,6}$/;
const BIRTHDATE_REGEXP  = /^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;
const QID_REGEXP        = /^[1-5]$/;
const ANSWER_REGEXP     = /^[가-힣]{1,10}$/;
const CODE_REGEXP       = /^[0-9a-zA-Z+=]{6}$/

module.exports = {
    email: EMAIL_REGEXP,
    password: PASSWORD_REGEXP,
    name: NAME_REGEXP,
    birthDate: BIRTHDATE_REGEXP,
    qid: QID_REGEXP,
    answer: ANSWER_REGEXP,
    code: CODE_REGEXP,
}