/*eslint-env node */

var Sequelize = require("sequelize");

module.exports = {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1
    },
    pseudo: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    login: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING
};
