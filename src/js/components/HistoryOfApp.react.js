/*global require, module*/
(function () {
    "use strict";
    var React = require("react"),
        Router = require("react-router"),
        RouteHandler = Router.RouteHandler,
        Login = require("./Login.react"),
        userStore = require("../stores/userStore"),
        userActions = require("../actions/userActions");

    /**
     * Will handle and display all the event of the timeline
     * Is also responsible for the global state of the application
     *
     * @return {undefined}
     */
    var HistoryOfApp = React.createClass({

        mixins: [Router.Navigation],

        getInitialState: function () {
            return {
                user: userStore.get()
            };
        },

        componentWillMount: function () {
            userStore.addChangeListener(this.userChange);
            userActions.getUser(userStore.getToken());
        },

        userChange: function () {
            this.setState(this.getInitialState());
        },

        render: function () {

            if (!userStore.hasToken()) {
                return (<Login/>);
            }

            if (!this.state.user) {
                return (<span> login in </span>);
            }

            return (
                <div id="historyof">
                    <h1>HistoryOf {this.state.user.firstname}</h1>
                    <a href="/#/">Dashboard</a>
                    <a href="/#/timelines/felix">Timeline</a>
                    <RouteHandler/>
                </div>
            );
        }

    });

    module.exports = HistoryOfApp;
}());
