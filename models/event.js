/*eslint-env node */

var Sequelize = require("sequelize");

module.exports = {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1
    },
    title: Sequelize.STRING,
    type: Sequelize.STRING,
    date: Sequelize.DATE,
    description: Sequelize.TEXT,
    timelineId: {
        type: Sequelize.UUID,
        model: "timeline",
        key: "id"
    }
};
