/*eslint-env node */

"use strict";
var db = require("../db/db"),
    assign = require("object-assign");

module.exports = {
    middlewares: {
        find: function (req, res, next) {
            db
                .model("event")
                .findOne({
                    where: { timeline_id: req.params.tid, id: req.params.eid }
                })
                .then(function (event) {
                    if (!event) {
                        var error = new Error("Event not found");
                        error.status = 404;
                        return next(error);
                    }
                    req.event = event;
                    next();
                });
        }
    },

    getAll: function (req, res) {
        res.send(req.timeline.get("events"));
    },

    create: function (req, res) {
        req.body.timeline_id = req.params.tid;

        db
            .model("event")
            .create(req.body)
            .then(function (event) {
                res.send(event.toJSON());
            });
    },

    get: function (req, res) {
        res.send(req.event.toJSON());
    },

    remove: function (req, res) {
        req
            .event
            .destroy()
            .then(function () {
                res.status(204).send();
            });

    },

    update: function (req, res, next) {
        req
            .event
            .update(req.body)
            .then(function (event) {
                res.send(event.toJSON());
            });
    }
};
