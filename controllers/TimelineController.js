/*eslint-env node */

"use strict";
var Timeline = require("../model/Timeline");

module.exports = {
    middlewares: {
        find: function (req, res, next) {
            req.timeline = req
                .user
                .timelines
                .id(req.params.id);

            next();
        }
    },

    getAll: function (req, res) {
        res.send(req.user.timelines);
    },

    create: function (req, res, next) {
        var timeline = new Timeline(req.body),
            user = req.user;

        user.timelines.push(timeline);
        user.save(function (err, data) {
            if (err) {
                next(new Error(err));
            }
            //send the last create timeline
            res.send(data.timelines.pop());
        });
    },

    get: function (req, res) {
        res.send(req.timeline);
    },

    update: function (req, res, next) {
        req.timeline.title = req.body.title;

        req.user.save(function (err) {
            if (err) {
                next(err);
            }
            res.send(req.timeline);
        });
    },

    remove: function (req, res, next) {
        req.timeline.remove();

        req.user.save(function (err) {
            if (err) { next(err); }
            res.status(204).send();
        });

    }
};
