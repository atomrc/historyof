/*eslint-env node */

var Sequelize = require("sequelize");

module.exports = {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1
    },
    login: {
        type: Sequelize.STRING,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        scopes: ["private"]
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING
};
