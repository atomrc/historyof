/*eslint-env node */

(function () {
    "use strict";
    var bodyParser = require("body-parser"),
        mongoose = require("mongoose"),
        express = require("express"),
        jwt = require("express-jwt"),
        User = require("./model/User"),
        TimelineController = require("./controllers/TimelineController"),
        UserController = require("./controllers/UserController"),
        EventController = require("./controllers/EventController");

    var app = express(),
        mongoConfig = {
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

    app.use(express.static("public", {}));
    app.use(bodyParser.json());

    //Json Web Token for logged part of the app
    app.use("/u", jwt({ secret: "tochange" }), function authenticate(req, res, next) {
        User.find(req.user, function (err, user) {
            if (err) { return next(err); }
            req.user = user;
            console.log(req.user);
            next();
        });
    });

    app.post("/login", UserController.login);


    app.get("/u", function (req, res) { res.send(req.user); });
    app.get("/u/timelines", TimelineController.getAll);
    app.get("/u/timelines/:id", TimelineController.get);
    app.get("/u/timelines/:tid/events", EventController.getAll);
    app.post("/u/timelines/:tid/events", EventController.create);
    app.get("/u/timelines/:tid/events/:id", EventController.get);
    app.delete("/u/timelines/:tid/events/:id", EventController.remove);
    app.put("/u/timelines/:tid/events/:id", EventController.update);

    var server = app.listen(process.env["PORT"] || 1337, function () {
        console.log("%s listening at %s", app.name, app.url);
    });
}());
