/*global require, document*/
(function () {
    "use strict";

    var Router = require("react-router"),
        Route = Router.Route,
        React = require("react"),
        App = require("./components/HistoryOfApp.react"),
        TimelineHandler = require("./components/routeHandlers/TimelineHandler.react");

    var routes = (
        <Route name="dashboard" path="/" handler={App}>
            <Route name="timeline" path="/timelines/:id" handler={TimelineHandler}/>
        </Route>
    );

    Router.run(routes, function (Handler) {
        React.render(<Handler/>, document.body);
    });
}());
