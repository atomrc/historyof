/*eslint-env node */

var Sequelize = require("sequelize");

module.exports = {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true
    },
    title: Sequelize.STRING,
    type: Sequelize.STRING,
    date: Sequelize.DATE,
    description: Sequelize.TEXT,
    user_id: {
        type: Sequelize.UUID,
        model: "user",
        key: "id"
    }
};
