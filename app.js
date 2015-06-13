/*eslint-env node */

"use strict";
var bodyParser = require("body-parser"),
    express = require("express"),
    jwt = require("express-jwt"),
    UserController = require("./controllers/UserController"),
    EventController = require("./controllers/EventController");

var app = express();

app.use(express.static("public", {}));
app.use(bodyParser.json());

app.post("/login", UserController.login);

app.post("/user/create", UserController.create);
//Json Web Token for logged part of the app
app.use("/u", jwt({ secret: "tochange" }), UserController.middlewares.authenticate);
app.get("/u", UserController.get);

app.post("/u/events", EventController.create);
app.get("/u/events", EventController.getAll);
app.get("/u/events/:eid", EventController.middlewares.find, EventController.get);
app.delete("/u/events/:eid", EventController.middlewares.find, EventController.remove);
app.put("/u/events/:eid", EventController.middlewares.find, EventController.update);

/*
app.get("/u/timelines", TimelineController.getAll);
app.post("/u/timelines", TimelineController.create);
app.get("/u/timelines/:tid", TimelineController.middlewares.find, TimelineController.get);
app.put("/u/timelines/:tid", TimelineController.middlewares.find, TimelineController.update);
app.delete("/u/timelines/:tid", TimelineController.middlewares.find, TimelineController.remove);
*/

app.use(function (err, req, res, next) {
    console.log(err.message);
    res.status(err.status || 500).send({ errors: err.message });
});

module.exports = app;
