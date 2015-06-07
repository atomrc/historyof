/*eslint-env node */

"use strict";
var app = require("./app"),
    db = require("./db/db");

db.init({
    host:     process.env["POSTGRESQL_ADDON_HOST"] || "localhost",
    user:     process.env["POSTGRESQL_ADDON_USER"] || "",
    password: process.env["POSTGRESQL_ADDON_PASSWORD"] || "",
    db:       process.env["POSTGRESQL_ADDON_DB"] || "historyof"
});

app.listen(process.env.PORT || 1337, function () {
    console.log("listening at %s", process.env.PORT || 1337);
});
