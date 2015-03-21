/* global module, require*/
(function () {
    "use strict";

    var Timeline = require("../model/Timeline");

    module.exports = {
        getAll: function (req, res) {
            Timeline.find().sort({date: "asc"}).select("-events").exec(function (err, timelines) {
                res.send(timelines);
            });
        },

        create: function (req, res) {
            var timeline = new Timeline(JSON.parse(req.body));
            timeline.save(function (err, data) {
                res.send(data);
            });
        },

        get: function (req, res) {
            Timeline.findById(req.params.id, function (err, timeline) {
                res.send(timeline);
            });
        },

        remove: function (req, res) {
            Timeline.remove({ _id: req.params.id }, function (err, nb, msg) {
                res.send(msg);
            });
        },

        update: function (req, res) {
            Timeline.where({ _id: req.params.id }).update(JSON.parse(req.body), function (err, nb, msg) {
                res.send(msg);
            });
        }
    };
}());
