/*global require, document*/
(function () {
    "use strict";

    var React = require("react"),
        ReactDom = require("react-dom"),
        ReactRouter = require("react-router"),
        Route = ReactRouter.Route,
        Router = ReactRouter.Router,
        AppHandler = require("./components/routeHandlers/AppHandler.react"),
        GuestHandler = require("./components/routeHandlers/GuestHandler.react"),
        Register = require("./components/Register.react"),
        Login = require("./components/Login.react"),
        UserHandler = require("./components/routeHandlers/UserHandler.react"),
        TimelineHandler = require("./components/routeHandlers/TimelineHandler.react");

    var routes = (
        <Router>
            <Route component={AppHandler}>
                <Route component={GuestHandler}>
                    <Route path="/register" component={Register}/>
                    <Route path="/login" component={Login}/>
                </Route>
                <Route component={UserHandler}>
                    <Route path="/me" component={TimelineHandler}/>
                </Route>
            </Route>
        </Router>
    );

    ReactDom.render(routes, document.getElementById("main"));
}());
