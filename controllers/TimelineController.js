/*eslint-env node */

"use strict";
var db = require("../db/db"),
    assign = require("object-assign");

module.exports = {

    middlewares: {
        find: function (req, res, next) {
            db
                .model("timeline")
                .findOne({
                    where: {
                        id: req.params.tid,
                        user_id: req.user.id
                    },
                    include: [db.model("event")]
                })
                .then(function (timeline) {
                    if (!timeline) {
                        var error = new Error("Timeline not found");
                        error.status = 404;
                        return next(error);
                    }

                    req.timeline = timeline;
                    next();
                });

        }
    },

    getAll: function (req, res) {
        res.send(req.user.timelines);
    },

    create: function (req, res) {
        db
            .model("timeline")
            .create({
                user_id: req.user.id,
                title: req.body.title
            })
            .then(function (tl) {
                var timeline = tl.toJSON();
                timeline.events = [];
                res.send(timeline);
            });
    },

    get: function (req, res) {
        res.send(req.timeline.toJSON());
    },

    update: function (req, res, next) {
        req
            .timeline
            .update(req.body)
            .then(function (timeline) {
                res.send(timeline.toJSON());
            })
            .catch(function (error) {
                next(error);
            });
    },

    remove: function (req, res) {
        req
            .timeline
            .destroy()
            .then(function () {
                res.status(204).send();
            });

    }
};
