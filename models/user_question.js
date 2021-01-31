module.exports = (sequelize, Datatypes) => {
    const user_question = sequelize.define('user_question', {
        answer: {
            type:           Datatypes.STRING(10),
            allowNull:      false,
        },
    }, {
        timestamps:         false,
        freezeTableName:    true,
        underscored:        true,
        talbeName:          "user_question",
        chartset:           "utf8mb4",
        collate:            "utf8mb4_general_ci",
    });

    return user_question;
};