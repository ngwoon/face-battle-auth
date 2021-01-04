module.exports = (sequelize, Datatypes) => {
    const user_question = sequelize.define('user_question', {
        answer: {
            type: Datatypes.STRING(10),
            allowNull: false,
        },
    }, {
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        talbeName: "user_question",
    });

    return user_question;
};