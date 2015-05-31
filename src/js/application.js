/*global require, document*/
(function () {
    "use strict";

    var Router = require("react-router"),
        Route = Router.Route,
        React = require("react"),
        App = require("./components/HistoryOfApp.react"),
        DashboardHandler = require("./components/routeHandlers/DashboardHandler.react"),
        TimelineHandler = require("./components/routeHandlers/TimelineHandler.react");

    var routes = (
        <Route handler={App}>
            <Route path="/" handler={DashboardHandler}/>
            <Route name="timeline" path="/timelines/:id" handler={TimelineHandler}/>
        </Route>
    );

    Router.run(routes, function (Handler) {
        React.render(<Handler/>, document.body);
    });
    /*
    var React = require("react"),
        HistoryOfApp = require("./components/HistoryOfApp.react");

    React.render(<HistoryOfApp/>, document.getElementById("main"));
    var actions = require("./actions/eventActions");

    actions.load();
    */
}());
