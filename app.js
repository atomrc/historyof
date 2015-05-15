/*eslint-env node */

"use strict";
var bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    express = require("express"),
    jwt = require("express-jwt"),
    TimelineController = require("./controllers/TimelineController"),
    UserController = require("./controllers/UserController"),
    EventController = require("./controllers/EventController");

var app = express(),
    mongoConfig = {
        host: process.env.MONGODB_ADDON_HOST || "localhost",
        port: process.env.MONGODB_ADDON_PORT || "27017",
        user: process.env.MONGODB_ADDON_USER || "",
        password: process.env.MONGODB_ADDON_PASSWORD || "",
        db: process.env.MONGODB_ADDON_DB || "historyofus"
    },
    mongoUrl = "mongodb://{user}:{password}@{host}/{db}"
        .replace("{host}", mongoConfig.host)
        .replace("{user}", mongoConfig.user)
        .replace("{port}", mongoConfig.port)
        .replace("{password}", mongoConfig.password)
        .replace("{db}", mongoConfig.db);

mongoose.connect(mongoUrl);

app.use(express.static("public", {}));
app.use(bodyParser.json());


app.post("/login", UserController.login);

//Json Web Token for logged part of the app
app.post("/user/create", UserController.create);
app.use("/u", jwt({ secret: "tochange" }), UserController.middlewares.authenticate);
app.get("/u", function (req, res) { res.send(req.user); });

app.get("/u/timelines", TimelineController.getAll);
app.post("/u/timelines", TimelineController.create);
app.use("/u/timelines/:tid", TimelineController.middlewares.find);
app.get("/u/timelines/:tid", TimelineController.get);
app.put("/u/timelines/:tid", TimelineController.update);
app.delete("/u/timelines/:tid", TimelineController.remove);

app.get("/u/timelines/:tid/events", EventController.getAll);
app.post("/u/timelines/:tid/events", EventController.create);
app.use("/u/timelines/:tid/events/:eid", EventController.middlewares.find);
app.get("/u/timelines/:tid/events/:eid", EventController.get);
app.delete("/u/timelines/:tid/events/:eid", EventController.remove);
app.put("/u/timelines/:tid/events/:eid", EventController.update);

app.listen(process.env.PORT || 1337, function () {
    console.log("listening at %s", process.env.PORT || 1337);
});
