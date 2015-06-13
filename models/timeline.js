/*eslint-env node */

var Sequelize = require("sequelize");

module.exports = {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1
    },
    title: Sequelize.STRING,
    user_id: {
        type: Sequelize.UUID,
        model: "user",
        key: "id"
    }
};
