/*global require, document*/
(function () {
    "use strict";

    var Router = require("react-router"),
        Route = Router.Route,
        React = require("react"),
        App = require("./components/HistoryOfApp.react"),
        TimelineHandler = require("./components/routeHandlers/TimelineHandler.react"),
        Register = require("./components/Register.react"),
        Login = require("./components/Login.react");

    var routes = (
        <Route>
            <Route name="login" path="/login" handler={Login}/>
            <Route name="register" path="/register" handler={Register}/>
            <Route name="dashboard" path="/" handler={App}>
                <Route name="timeline" path="/timelines/:id" handler={TimelineHandler}/>
            </Route>
        </Route>
    );

    Router.run(routes, function (Handler) {
        React.render(<Handler/>, document.body);
    });
}());
