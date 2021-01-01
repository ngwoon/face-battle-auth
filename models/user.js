module.exports = (sequelize, Datatypes) => {
    const user = sequelize.define('user', {
        uid: {
            type: Datatypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: Datatypes.STRING(30),
            allowNull: true,
        },
        password: {
            type: Datatypes.STRING(256),
            allowNull: true,
        },
        name: {
            type: Datatypes.STRING(20),
            allowNull: false,
        },
        birth_date: {
            type: Datatypes.STRING(8),
            allowNull: true,
        },
        type: {
            type: Datatypes.INTEGER,
            allowNull: true,
        },
        valid: {
            type: Datatypes.INTEGER,
            allowNull: false,
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        talbeName: "user",
    });

    user.associate = (models) => {
        const { question, user_question } = models;
    
        user.question = user.belongsToMany(question, {
            through: user_question,
            foreignKey: "uid",
        });
    };

    return user;
};