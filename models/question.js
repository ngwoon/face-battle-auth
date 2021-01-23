module.exports = (sequelize, Datatypes) => {
    const question = sequelize.define('question', {
        qid: {
            type: Datatypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: Datatypes.STRING(20),
            allowNull: false,
        },
    }, {
        timestamps: false,
        freezeTableName: true,
        talbeName: "question",
        underscored: true,
        chartset: "utf8mb4",
        collate: "utf8mb4_general_ci",
    });

    question.associate = (models) => {
        const { user, user_question } = models;
    
        question.user = question.belongsToMany(user, {
            through: user_question,
            // primaryKey: true,
            foreignKey: "qid",
        });
    };

    return question;
};