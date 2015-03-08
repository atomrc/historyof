/*global require*/

(function () {
    "use strict";
    var mongoose = require("mongoose"),
        express = require("express"),
        Event = require("./model/Event");

    var app = express();

    var mongoConfig = {
            host: process.env["MONGODB_ADDON_HOST"] || "localhost",
            port: process.env["MONGODB_ADDON_PORT"] || "27017",
            user: process.env["MONGODB_ADDON_USER"] || "",
            password: process.env["MONGODB_ADDON_PASSWORD"] || "",
            db: process.env["MONGODB_ADDON_DB"] || "historyofus"
        },
        mongoUrl = "mongodb://{user}:{password}@{host}/{db}"
            .replace("{host}", mongoConfig.host)
            .replace("{user}", mongoConfig.user)
            .replace("{port}", mongoConfig.port)
            .replace("{password}", mongoConfig.password)
            .replace("{db}", mongoConfig.db)
        ;

    mongoose.connect(mongoUrl);

    app.use(express.static('public', {}));

    app.get("/events", function (req, res) {
        Event.find().sort({date: "asc"}).exec(function (err, events) {
            res.send(events);
        });
    });

    app.post("/events", function (req, res) {
        var event = new Event(JSON.parse(req.body));
        event.save(function (err, data) {
            res.send(data);
        });
    });

    app.get("/events/:id", function (req, res) {
        Event.findById(req.params.id, function (err, event) {
            res.send(event);
        });
    });

    app.delete("/events/:id", function (req, res) {
        Event.remove({ _id: req.params.id }, function (err, nb, msg) {
            res.send(msg);
        });
    });

    app.put("/events/:id", function (req, res) {
        Event.where({ _id: req.params.id }).update(JSON.parse(req.body), function (err, nb, msg) {
            res.send(msg);
        });
    });

    var server = app.listen(process.env["PORT"] || 1337, function () {
        console.log("%s listening at %s", app.name, app.url);
    });
}());
