/*eslint-env node */

"use strict";
var db = require("../db/db");

var sequelize = db.init({ db: "historyoftest" });

module.exports = {
    init: function (callback) {
        sequelize.sync({ force: true }).then(callback);
    }
};
