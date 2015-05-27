/*eslint-env node */

var db = require("../db/db");

var sequelize = db.init();

sequelize.sync({force: true}).then(function () {
    console.log(arguments);
});
