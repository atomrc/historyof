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
            db.query({
                text: "SELECT * FROM users WHERE id=$1",
                values: [req.user]
            }, function (err, result) {
                if (err) { return next(err); }
                req.user = result.rows[0];
                delete req.user.password;
                next();
            });
        }
    },

    get: function (req, res) {
        res.send(req.user);
    },

    create: function (req, res, next) {
        db.query({
            text: "INSERT INTO users (login, password, firstname, lastname) VALUES ($1, $2, $3, $4) RETURNING *",
            values: [req.body.login, req.body.password, req.body.firstname, req.body.lastname]
        }, function (err, result) {
            if (err) { return next(err); }
            var user = result.rows[0];
            delete user.password;

            res.send({
                user: user,
                token: createToken(user)
            });
        });
    },

    login: function (req, res, next) {

        if (!req.body.login || !req.body.password) {
            return res.status(400).send("You must send the login and the password");
        }

        db.query({
            text: "SELECT * FROM users WHERE login=$1",
            values: [req.body.login]
        }, function (err, result) {
            if (err) { return next(err); }

            var user = result.rows[0];
            delete user.password;

            if (!user || user.password !== req.body.password) {
                return res.status(401).send("The login or password don't match");
            }

            res.send({
                token: createToken(user),
                user: user
            });
        });

    }
};
