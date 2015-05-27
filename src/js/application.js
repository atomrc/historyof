/*global require, document*/
(function () {
    "use strict";

    var Router = require("react-router"),
        Route = Router.Route,
        React = require("react"),
        App = require("./components/HistoryOfApp.react");

    var Dashboard = React.createClass({
        render: function () {
            return (<div>Dashboard</div>);
        }
    });

    var Timeline = React.createClass({
        render: function () {
            return (<div>Timeline</div>);
        }
    });

    var routes = (
        <Route handler={App}>
            <Route path="/" handler={Dashboard}/>
            <Route path="/timelines/:id" handler={Timeline}/>
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
