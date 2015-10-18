/*global require, document*/
(function () {
    "use strict";

    var React = require("react"),
        ReactDom = require("react-dom"),
        ReactRouter = require("react-router"),
        Route = ReactRouter.Route,
        Router = ReactRouter.Router,
        AppHandler = require("./components/routeHandlers/AppHandler.react"),
        Register = require("./components/Register.react"),
        UserHandler = require("./components/routeHandlers/UserHandler.react"),
        TimelineHandler = require("./components/routeHandlers/TimelineHandler.react");

    var routes = (
        <Router>
            <Route path="/register" component={Register}/>
            <Route component={AppHandler}>
                <Route component={UserHandler}>
                    <Route path="/" component={TimelineHandler}/>
                </Route>
            </Route>
        </Router>
    );

    ReactDom.render(routes, document.getElementById("main"));
}());
