/*global require, document*/
"use strict";
var React = require("react"),
    ReactDom = require("react-dom"),
    ReactRouter = require("react-router"),
    Route = ReactRouter.Route,
    Router = ReactRouter.Router,
    createBrowserHistory = require("history/lib/createBrowserHistory"),
    AppContainer = require("./components/containers/AppContainer.react"),
    GuestContainer = require("./components/containers/GuestContainer.react"),
    Register = require("./components/Register.react"),
    TimelineContainer = require("./components/containers/TimelineContainer.react");

var routes = (
    <Router history={createBrowserHistory()}>
        <Route components={GuestContainer}>
            <Route path="/register" component={Register}/>
        </Route>
        <Route component={AppContainer}>
            <Route path="/me" component={TimelineContainer}/>
        </Route>
    </Router>
);

ReactDom.render(routes, document.getElementById("main"));
