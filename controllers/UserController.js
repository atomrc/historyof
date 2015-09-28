/*eslint-env node */
"use strict";

var jwt = require("jsonwebtoken"),
    bcrypt = require("bcryptjs"),
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

    isPropertyAvailable: function (req, res) {
        var condition = { };
        condition[req.params.property] = req.params.value;
        db
            .model("user")
            .findOne({ where: condition })
            .then(function (result) {
                res.send({ available: !result });
            });
    },

    get: function (req, res) {
        res.send(req.user.toJSON());
    },

    create: function (req, res, next) {
        var newUser = req.body;

        if (newUser.password !== newUser.passwordConfirmation) {
            var error = new Error("passwords do not match");
            error.status = 400;
            return next(error);
        }

        bcrypt.hash(newUser.password, 10, function (err, result) {
            if (err) {
                return next(err);
            }
            newUser.password = result;

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

        });
    },

    login: function (req, res, next) {

        if (!req.body.login || !req.body.password) {
            var error = new Error("login or password missing");
            error.status = 400;
            return next(error);
        }

        db
            .model("user")
            .findOne({ where: { login: req.body.login }})
            .then(function (user) {

                if (!user) {
                    var error = new Error("The login or password don't match");
                    error.status = 401;
                    return next(error);
                }

                bcrypt.compare(req.body.password, user.password, function (err, result) {
                    if (err || !result) {
                        var error = new Error("The login or password don't match");
                        error.status = 401;
                        return next(error);
                    }
                    var u = user.toJSON();
                    res.send({
                        token: createToken(u),
                        user: u
                    });
                });
        });

    }
};
