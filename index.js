/*eslint-env node */

"use strict";
var app = require("./app"),
    db = require("./db/db");

db.init({});

app.listen(process.env.PORT || 1337, function () {
    console.log("listening at %s", process.env.PORT || 1337);
});
