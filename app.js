/*eslint-env node */

"use strict";
var bodyParser = require("body-parser"),
    express = require("express"),
    jwt = require("express-jwt"),
    UserController = require("./controllers/UserController"),
    EventController = require("./controllers/EventController");

var app = express();

app.use(express.static("public", {}));
function sendApp(req, res) {
    res.sendFile(__dirname + "/public/app.html");
}
app.use("/me", sendApp);
app.use("/register", sendApp);
app.use("/login", sendApp);
app.use(bodyParser.json());

/** front **/

/** API methods **/
app.post("/user/authenticate", UserController.login);
app.post("/user/create", UserController.create);
app.get("/check/:property/:value", UserController.isPropertyAvailable);

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
    res.status(err.status || 500).send({ error: err.message });
});

module.exports = app;
