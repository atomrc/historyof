/*eslint-env node */

"use strict";
var app = require("./app"),
    db = require("./db/db"),
    config = require("./config/config");

db.init(config.db);

app.listen(process.env.PORT || 1337, function () {
    console.log("listening at %s", process.env.PORT || 1337);
});
