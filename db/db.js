/*eslint-env node */

"use strict";
var pg = require("pg"),
    assign = require("object-assign");

var connectionUrlPattern = "postgres://{user}:{password}@{host}/{db}",
    connectionUrl,
    defaultConfig = {
        host: "localhost",
        user: "",
        password: "",
        db: "historyof"
    };

module.exports = {

    init: function (params) {

        var config = assign({}, defaultConfig, params);

        connectionUrl = connectionUrlPattern
            .replace("{user}", config.user)
            .replace("{password}", config.password)
            .replace("{host}", config.host)
            .replace("{db}", config.db);
    },

    query: function (queryStr, callback) {
        pg.connect(connectionUrl, function (err, client, done) {
            if (err) {
                done();
                return callback(err);
            }
            client.query(queryStr, function (error, results) {
                callback(error, results);
                done();
            });
        });
    }
};
