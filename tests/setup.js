/*eslint-env node */

"use strict";
var db = require("../db/db"),
    config = require("../config/config");


config.db = "historyoftest";
var sequelize = db.init(config);

module.exports = {
    init: function (callback) {
        sequelize.sync({ force: true }).then(callback);
    }
};
