var mongoose = require("mongoose");

var mongoConfig = {
        host: process.env.MONGODB_ADDON_HOST || "localhost",
        port: process.env.MONGODB_ADDON_PORT || "27017",
        user: process.env.MONGODB_ADDON_USER || "",
        password: process.env.MONGODB_ADDON_PASSWORD || "",
        db: process.env.MONGODB_ADDON_DB || "historyoftest"
    },
    mongoUrl = "mongodb://{user}:{password}@{host}/{db}"
        .replace("{host}", mongoConfig.host)
        .replace("{user}", mongoConfig.user)
        .replace("{port}", mongoConfig.port)
        .replace("{password}", mongoConfig.password)
        .replace("{db}", mongoConfig.db);


module.exports = {
    init: function (callback) {
        mongoose.connect(mongoUrl, function () {
            mongoose.connection.db.dropDatabase(function () {
                callback();
                mongoose.connection.close();
            });
        });

    }
};
