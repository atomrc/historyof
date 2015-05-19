/*eslint-env node */

"use strict";
var db = require("../db/db");

db.init({ db: "historyoftest" });

module.exports = {
    init: function (callback) {
        db.query("TRUNCATE users CASCADE", callback);
    }
};
