module.exports = (sequelize, Datatypes) => {
    const user = sequelize.define('user', {
        uid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
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
    });
};