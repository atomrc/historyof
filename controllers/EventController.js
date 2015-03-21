/* global module, require*/
(function () {
    "use strict";

    var Event = require("../model/Event");

    module.exports = {
        getAll: function (req, res) {
            Event.find().sort({date: "asc"}).exec(function (err, events) {
                res.send(events);
            });
        },

        create: function (req, res) {
            var event = new Event(JSON.parse(req.body));
            event.save(function (err, data) {
                res.send(data);
            });
        },

        get: function (req, res) {
            Event.findById(req.params.id, function (err, event) {
                res.send(event);
            });
        },

        remove: function (req, res) {
            Event.remove({ _id: req.params.id }, function (err, nb, msg) {
                res.send(msg);
            });
        },

        update: function (req, res) {
            Event.where({ _id: req.params.id }).update(JSON.parse(req.body), function (err, nb, msg) {
                res.send(msg);
            });
        }
    };
}());
