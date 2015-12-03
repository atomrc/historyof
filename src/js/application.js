/*global require, document*/
"use strict";

var React = require("react"),
    render = require("react-dom").render,
    ReactRouter = require("react-router"),
    Route = ReactRouter.Route,
    Router = ReactRouter.Router,
    createHistory = require("history/lib/createBrowserHistory"),
    thunk = require("redux-thunk"),
    Provider = require("react-redux").Provider,
    ReduxRouter = require("redux-router"),
    Redux = require("redux"),
    appReducers = require("./reducers/appReducers"),
    AppContainer = require("./components/containers/AppContainer.react"),
    TimelineContainer = require("./components/containers/TimelineContainer.react"),
    Register = require("./components/Register.react");

var routes = (
    <Router>
        <Route path="/register" component={Register}></Route>
        <Route component={AppContainer}>
            <Route path="/me" component={TimelineContainer}/>
        </Route>
    </Router>
);

var store = Redux.compose(
    Redux.applyMiddleware(thunk),
    ReduxRouter.reduxReactRouter({ routes, createHistory })
)(Redux.createStore)(appReducers, {
    user: {},
    stories: [],
    token: window.localStorage.getItem("token")
});

render(
    <Provider store={store}>
        <ReduxRouter.ReduxRouter>
            {routes}
        </ReduxRouter.ReduxRouter>
    </Provider>,
    document.getElementById("main")
);

/*
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
*/
