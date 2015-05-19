/*eslint-env node */

"use strict";
var db = require("../db/db"),
    assign = require("object-assign");

module.exports = {
    middlewares: {
        find: function (req, res, next) {
            db.query({
                text: "SELECT * FROM events WHERE timeline_id=$1 and id=$2",
                values: [req.params.tid, req.params.eid]
            }, function (err, result) {
                if (err) { return next(err); }
                req.event = result.rows[0];
                next();
            });
        }
    },

    getAll: function (req, res, next) {
        db.query({
            text: "SELECT * FROM events WHERE timeline_id=$1",
            values: [req.params.tid]
        }, function (err, result) {
            if (err) { return next(err); }
            res.send(result.rows);
        });
    },

    create: function (req, res, next) {
        var body = req.body;
        db.query({
            text: "INSERT INTO events (timeline_id, title, type, description, date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            values: [req.timeline.id, body.title, body.type, body.description, body.date]
        }, function (err, result) {
            if (err) { return next(err); }

            var event = result.rows[0];
            res.send(event);
        });
    },

    get: function (req, res) {
        res.send(req.event);
    },

    remove: function (req, res, next) {
        db.query({
            text: "DELETE FROM events WHERE id=$1",
            values: [req.params.eid]
        }, function(err) {
            if (err) { return next(err); }
            res.status(204).send();
        });
    },

    update: function (req, res, next) {
        var update = assign({}, req.event, req.body);
        db.query({
            text: "UPDATE events SET title=$1, type=$2, description=$3, date=$4 WHERE id=$5 RETURNING *",
            values: [update.title, update.type, update.description, update.date, req.params.eid]
        }, function(err, result) {
            if (err) { return next(err); }
            res.send(result.rows[0]);
        });
    }
};
