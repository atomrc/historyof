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
                    where: { id: req.user }
                })
                .then(function (user) {
                    if (!user) {
                        var error = new Error("User not found");
                        error.status = 404;
                        return next(error);
                    }
                    req.user = user;
                    next();
                });
        }
    },

    get: function (req, res) {
        res.send(req.user.toJSON());
    },

    create: function (req, res, next) {
        var newUser = req.body;

        if (newUser.password !== newUser.passwordConfirmation) {
            var error = new Error("passwords do not matche");
            error.status = 400;
            return next(error);
        }

        db
            .model("user")
            .create(newUser)
            .then(function (data) {
                var user = data.toJSON(),
                    token = createToken(user);

                    res.send({
                        token: token,
                        user: user
                    });
            })
            .catch(function (err) {
                err.status = 400;
                next(err);
            });
    },

    login: function (req, res) {

        if (!req.body.login || !req.body.password) {
            return res.status(400).send("You must send the login and the password");
        }

        db
            .model("user")
            .findOne({ where: { login: req.body.login }})
            .then(function (user) {
                if (!user || user.get("password") !== req.body.password) {
                    return res.status(401).send("The login or password don't match");
                }

                var u = user.toJSON();
                res.send({
                    token: createToken(u),
                    user: u
                });
        });

    }
};
