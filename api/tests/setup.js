/*eslint-env node */

"use strict";
require("dotenv").load();
var db = require("../db/db"),
    config = require("../config/config");

var sequelize = db.init(config.db);

module.exports = {
    reset: function (callback) {
        var options = { raw: true };

        sequelize
            .query("truncate table stories cascade", options)
            .then(callback);
    },

    disconnect: function () {
        sequelize.close();
    }
};
