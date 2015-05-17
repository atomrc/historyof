/*eslint-env node */

"use strict";
var Event = require("../model/Event"),
    Timeline = require("../model/Timeline");

module.exports = {
    middlewares: {
        find: function (req, res, next) {
            var event = req
                .timeline
                .events
                .filter(function (event) {
                    return event.id.toString() === req.params.eid;
                });

            if (event.length === 0) {
                return res.status(404).send();
            }

            req.event = event[0];
            next();
        }
    },

    getAll: function (req, res) {
        Timeline.populate(req.timeline, "events", function (err, data) {
            if (err) {
                return res.status(500).send(err);
            }
            return res.send(data.events);
        });
    },

    create: function (req, res) {
        var event = new Event(req.body);
        event.save(function (err, data) {
            if (err) {
                return res.status(500).send(err);
            }
            req.timeline.events.push(data);
            req.user.save(function () {});
            res.send(data);
        });
    },

    get: function (req, res) {
        Event.findById(req.params.id, function (err, event) {
            if (err) {
                return res.status(500).send(err);
            }
            res.send(event);
        });
    },

    remove: function (req, res) {
        Event.remove({ _id: req.params.id }, function (err, nb, msg) {
            if (err) {
                return res.status(500).send(err);
            }
            res.send(msg);
        });
    },

    update: function (req, res) {
        var e = req.event;
        e.title = req.body.title;
        e.save(function (err, event) {
            if (err) {
                return res.status(500).send(err);
            }
            res.send(event);
        });
    }
};
