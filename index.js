/*eslint-env node */

"use strict";
var app = require("./app"),
    mongoose = require("mongoose");

var mongoConfig = {
        host: process.env.MONGODB_ADDON_HOST || "localhost",
        port: process.env.MONGODB_ADDON_PORT || "27017",
        user: process.env.MONGODB_ADDON_USER || "",
        password: process.env.MONGODB_ADDON_PASSWORD || "",
        db: process.env.MONGODB_ADDON_DB || "historyofus"
    },
    mongoUrl = "mongodb://{user}:{password}@{host}/{db}"
        .replace("{host}", mongoConfig.host)
        .replace("{user}", mongoConfig.user)
        .replace("{port}", mongoConfig.port)
        .replace("{password}", mongoConfig.password)
        .replace("{db}", mongoConfig.db);

mongoose.connect(mongoUrl);

app.listen(process.env.PORT || 1337, function () {
    console.log("listening at %s", process.env.PORT || 1337);
});
