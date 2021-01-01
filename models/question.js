module.exports = (sequelize, Datatypes) => {
    const question = sequelize.define('question', {
        qid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        title: {
            type: Datatypes.STRING(20),
            allowNull: false,
        },
    });
};