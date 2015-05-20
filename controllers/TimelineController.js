/*eslint-env node */

"use strict";
var db = require("../db/db"),
    assign = require("object-assign");

module.exports = {
    middlewares: {
        find: function (req, res, next) {
            db.query({
                text: "SELECT * FROM timelines WHERE user_id=$1 AND id=$2",
                values: [req.user.id, req.params.tid]
            }, function (err, result) {
                if (err) { return next(err); }
                if (result.rows.length === 0) {
                    var error = new Error();
                    error.status = 404;
                    return next(error);
                }
                req.timeline = result.rows[0];
                next();
            });
        }
    },

    getAll: function (req, res, next) {
        db.query({
            text: "SELECT * FROM timelines WHERE user_id=$1",
            values: [req.user.id]
        }, function (err, result) {
            if (err) { return next(err); }
            res.send(result.rows);
        });
    },

    create: function (req, res, next) {
        db.query({
            text: "INSERT INTO timelines (user_id, title) VALUES ($1, $2) RETURNING *",
            values: [req.user.id, req.body.title]
        }, function (err, result) {
            if (err) { return next(err); }
            var timeline = result.rows[0];

            res.send(timeline);
        });
    },

    get: function (req, res) {
        res.send(req.timeline);
    },

    update: function (req, res, next) {
        var update = assign({}, req.timeline, req.body);

        db.query({
            text: "UPDATE timelines SET title=$1 WHERE id=$2 RETURNING *",
            values: [update.title, req.params.tid]
        }, function(err, result) {
            if (err) { return next(err); }
            res.send(result.rows[0]);
        });
    },

    remove: function (req, res, next) {
        db.query({
            text: "DELETE FROM timelines WHERE id=$1",
            values: [req.params.tid]
        }, function(err) {
            if (err) { return next(err); }
            res.status(204).send();
        });
    }
};
