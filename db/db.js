/*eslint-env node */

"use strict";
var Sequelize = require("sequelize"),
    Instance = require("sequelize").Instance;

var init = false,
    models = {};

module.exports = {

    init: function (config) {
        if (init) {
            throw new Error("db is already initiated");
        }

        var sequelize = new Sequelize(config.db, config.user, config.password, {
            host: config.host,
            port: config.port,
            dialect: "postgres",
            logging: false
        });

        ["user", "timeline", "event"].forEach(function (element) {
            models[element] = sequelize.define(element, require("../models/" + element), {
                instanceMethods: {
                    toJSON: function () {
                        var ret = Instance.prototype.toJSON.call(this);

                        delete ret.password;
                        return ret;
                    }
                }
            });
        });

        models.user.hasMany(models.timeline);
        models.timeline.hasMany(models.event);

        return sequelize;
    },

    model: function (modelName) {
        if (!models) {
            throw new Error("db is not initiated");
        }
        if (!models[modelName]) {
            throw new Error("model " + modelName + " does not exist");
        }
        return models[modelName];
    }

};
