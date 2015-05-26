/*eslint-env node */
"use strict";

var jwt = require("jsonwebtoken"),
    db = require("../db/db");

function createToken(user) {
    return jwt.sign(user.id, "tochange", { expiresInMinutes: 60 * 5 });
}

module.exports = {

    middlewares: {
        authenticate: function authenticate(req, res, next) {
            db
                .model("user")
                .findOne({
                    where: { id: req.user },
                    include: [db.model("timeline")]
                })
                .then(function (data) {
                    req.user = data;
                    next();
                });
        }
    },

    get: function (req, res) {
        res.send(req.user.toJSON());
    },

    create: function (req, res) {
        db
            .model("user")
            .create(req.body)
            .then(function (data) {
                var user = data.toJSON(),
                    token = createToken(user);

                user.timelines = [];

                res.send({
                    token: token,
                    user: user
                });
            });
    },

    login: function (req, res) {

        if (!req.body.login || !req.body.password) {
            return res.status(400).send("You must send the login and the password");
        }

        db
            .model("user")
            .findOne({ where: { login: req.body.login }, include: [db.model("timeline")]})
            .then(function (result) {
                var user = result.dataValues;

                if (!user || user.password !== req.body.password) {
                    return res.status(401).send("The login or password don't match");
                }

                delete user.password;
                res.send({
                    token: createToken(user),
                    user: user
                });
        });

    }
};
