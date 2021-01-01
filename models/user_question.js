module.exports = (sequelize, Datatypes) => {
    const user_question = sequelize.define('user_question', {
        answer: {
            type: Datatypes.STRING(30),
            allowNull: true,
        },
    });
};