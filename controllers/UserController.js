/* global module, require*/
(function () {
    "use strict";

    var User = require("../model/User"),
        jwt = require("jsonwebtoken");

    function createToken(user) {
        return jwt.sign(user.id, "tochange", { expiresInMinutes: 60 * 5 });
    }

    module.exports = {

        middlewares: {
            authenticate: function authenticate(req, res, next) {
                User.findOne(req.user, function (err, user) {
                    if (err) { return next(err); }
                    req.user = user;
                    next();
                });
            }
        },

        create: function (req, res) {
            var user = new User(JSON.parse(req.body));
            user.save(function (err, data) {
                res.send(data);
            });
        },

        login: function (req, res) {

            if (!req.body.login || !req.body.password) {
                return res.status(400).send("You must send the login and the password");
            }

            User.findOne({login: req.body.login}, function (err, user) {
                if (!user) {
                    return res.status(401).send("The login or password don't match");
                }
                if (!user.password === req.body.password) {
                    return res.status(401).send("The login or password don't match");
                }
                res.status(201).send({
                    token: createToken(user),
                    user: user
                });
            });

        }
    };
}());
