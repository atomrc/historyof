/*global require*/

(function () {
    "use strict";
    var mongoose = require("mongoose"),
        restify = require("restify"),
        Event = require("./model/Event");

    mongoose.connect("mongodb://localhost/historyofus");

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

    server.listen(1337, function () {
        console.log("%s listening at %s", server.name, server.url);
    });
}());
