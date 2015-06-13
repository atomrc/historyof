/*global require, document*/
(function () {
    "use strict";

    var Router = require("react-router"),
        Route = Router.Route,
        React = require("react"),
        AppHandler = require("./components/routeHandlers/AppHandler.react"),
        Register = require("./components/Register.react"),
        UserHandler = require("./components/routeHandlers/UserHandler.react"),
        TimelineHandler = require("./components/routeHandlers/TimelineHandler.react");

    var routes = (
        <Route>
            <Route name="register" path="/register" handler={Register}/>
            <Route handler={AppHandler}>
                <Route name="home" path="/" handler={UserHandler}>
                    <Route name="timeline" path="/" handler={TimelineHandler}/>
                </Route>
            </Route>
        </Route>
    );

    Router.run(routes, function (Handler) {
        React.render(<Handler/>, document.body);
    });
}());
