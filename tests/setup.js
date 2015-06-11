/*eslint-env node */

"use strict";
require("dotenv").load();
var db = require("../db/db"),
    config = require("../config/config");


var sequelize = db.init(config.db);

module.exports = {
    init: function (callback) {
        sequelize.sync({ force: true }).then(callback);
    }
};
