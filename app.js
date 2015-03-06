/*global require*/

(function () {
    "use strict";
    var mongoose = require("mongoose"),
        restify = require("restify"),
        Event = require("./model/Event");

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

    var server = restify.createServer({
        name: "historyof.us",
        version: "1.0.0"
    });

    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.queryParser());
    server.use(function crossOrigin(req,res,next){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        return next();
    });
    server.use(function (req, res, next) {
        res.set({"content-type": "application/json; charset=utf-8"});
        next();
    });
    server.use(restify.bodyParser());

    server.get("/events", function (req, res, next) {
        Event.find().sort({date: "asc"}).exec(function (err, events) {
            res.send(events);
        });
        return next();
    });

    server.post("/events", function (req, res, next) {
        var event = new Event(JSON.parse(req.body));
        event.save(function (err, data) {
            res.send(data);
        });
        return next();
    });

    server.get("/events/:id", function (req, res, next) {
        Event.findById(req.params.id, function (err, event) {
            res.send(event);
        });
        return next();
    });

    server.del("/events/:id", function (req, res, next) {
        Event.remove({ _id: req.params.id }, function (err, nb, msg) {
            res.send(msg);
        });
        return next();
    });

    server.put("/events/:id", function (req, res, next) {
        Event.where({ _id: req.params.id }).update(JSON.parse(req.body), function (err, nb, msg) {
            res.send(msg);
        });
        return next();
    });

    server.listen(process.env["PORT"] || 1337, function () {
        console.log("%s listening at %s", server.name, server.url);
    });
}());
