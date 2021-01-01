module.exports = (sequelize, Datatypes) => {
    const verification_code = sequelize.define('verification_code', {
        cid: {
            type: Datatypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        code: {
            type: Datatypes.STRING(6),
            allowNull: false,
        },
        expiry_date: {
            type: Datatypes.STRING(20),
            allowNull: false,
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        talbeName: "verification_code",
        underscored: true,
    });

    return verification_code;
};