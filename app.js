/*eslint-env node */

"use strict";
var bodyParser = require("body-parser"),
    express = require("express"),
    jwt = require("express-jwt"),
    UserController = require("./controllers/UserController"),
    StoriesController = require("./controllers/StoriesController");

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

app.post("/u/stories", StoriesController.create);
app.get("/u/stories", StoriesController.getAll);
app.get("/u/stories/:eid", StoriesController.middlewares.find, StoriesController.get);
app.delete("/u/stories/:eid", StoriesController.middlewares.find, StoriesController.remove);
app.put("/u/stories/:eid", StoriesController.middlewares.find, StoriesController.update);

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
