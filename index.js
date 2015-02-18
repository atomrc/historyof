/*global require*/

(function () {
    "use strict";
    var mongoose = require("mongoose"),
        restify = require("restify");

    mongoose.connect("mongodb://localhost/historyofus");

    var EventSchema = new mongoose.Schema({
        title: String,
        type: String,
        date: Date,
        text: String,
        place: String,
        comment: String,
        created: Date,
        updated: Date
    });

    var Event = mongoose.model("Event", EventSchema);

    EventSchema.pre("save", function (next) {
        if (!this.created) {
            this.created = new Date();
        } else {
            this.updated = new Date();
        }
        next();
    });

    // Duplicate the ID field.
    EventSchema.virtual("id").get(function(){
        return this._id.toHexString();
    });

    // Ensure virtual fields are serialised.
    EventSchema.set("toJSON", {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        },
        virtuals: true
    });

    var server = restify.createServer({
        name: "historyof.us",
        version: "1.0.0"
    });

    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.queryParser());
    server.use(function (req, res, next) {
        res.set({"content-type": "application/json; charset=utf-8"});
        next();
    });
    server.use(restify.bodyParser());

    server.get("/events", function (req, res, next) {
        Event.find(function (err, events) {
            res.send(events);
        });
        return next();
    });

    server.get("/events/:id", function (req, res, next) {
        Event.findById(req.params.id, function (err, event) {
            res.send(event);
        });
        return next();
    });

    server.listen(1337, function () {
        console.log("%s listening at %s", server.name, server.url);
    });
}());
