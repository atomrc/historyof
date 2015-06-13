/*eslint-env node */

"use strict";
var bodyParser = require("body-parser"),
    express = require("express"),
    jwt = require("express-jwt"),
    UserController = require("./controllers/UserController"),
    TimelineController = require("./controllers/TimelineController"),
    EventController = require("./controllers/EventController");

var app = express();

app.use(express.static("public", {}));
app.use(bodyParser.json());

app.post("/login", UserController.login);

app.post("/user/create", UserController.create);
//Json Web Token for logged part of the app
app.use("/u", jwt({ secret: "tochange" }), UserController.middlewares.authenticate);
app.get("/u", UserController.get);

app.get("/u/timelines", TimelineController.getAll);
app.post("/u/timelines", TimelineController.create);
app.get("/u/timelines/:tid", TimelineController.middlewares.find, TimelineController.get);
app.put("/u/timelines/:tid", TimelineController.middlewares.find, TimelineController.update);
app.delete("/u/timelines/:tid", TimelineController.middlewares.find, TimelineController.remove);

app.get("/u/timelines/:tid/events", TimelineController.middlewares.find, EventController.getAll);
app.post("/u/timelines/:tid/events", EventController.create);
app.get("/u/timelines/:tid/events/:eid", EventController.middlewares.find, EventController.get);
app.delete("/u/timelines/:tid/events/:eid", EventController.middlewares.find, EventController.remove);
app.put("/u/timelines/:tid/events/:eid", EventController.middlewares.find, EventController.update);

app.use(function (err, req, res, next) {
    res.status(err.status || 500).send({ errors: err.message });
});

module.exports = app;
