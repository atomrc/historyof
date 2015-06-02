/*global require, module*/
(function () {
    "use strict";
    var React = require("react"),
        Router = require("react-router"),
        Link = require("react-router").Link,
        RouteHandler = Router.RouteHandler,
        Timelines = require("./Timelines.react"),
        timelineStore = require("../stores/timelineStore"),
        currentTimelineStore = require("../stores/currentTimelineStore"),
        userStore = require("../stores/userStore"),
        userActions = require("../actions/userActions"),
        timelineActions = require("../actions/timelineActions");

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
                user: userStore.get(),
                token: userStore.getToken(),
                timelines: timelineStore.get(),
                currentTimeline: currentTimelineStore.get()
            };
        },

        componentWillMount: function () {
            userStore.addChangeListener(this.modelChange);
            timelineStore.addChangeListener(this.modelChange);
            currentTimelineStore.addChangeListener(this.modelChange);

            if (!userActions.getToken()) {
                return this.transitionTo("login");
            }
        },

        componentWillUnmount: function () {
            timelineStore.removeChangeListener(this.modelChange);
            userStore.removeChangeListener(this.modelChange);
            currentTimelineStore.removeChangeListener(this.modelChange);
        },

        modelChange: function () {
            this.setState(this.getInitialState());
            if (this.state.token && !this.state.user) {
                userActions.getUser();
            }
            if (this.state.user && this.state.user.timelines.length === 0) {
                timelineActions.create({ title: this.state.user.pseudo + "'s story" });
            }
        },

        logout: function () {
            userActions.logout();
        },

        render: function () {

            if (!this.state.user) {
                return (<span> login in... </span>);
            }

            return (
                <div>
                    <header id="app-header">
                        <Link to="dashboard">HistoryOf </Link>
                        <span className="user">{this.state.user.firstname}</span>
                        <button onClick={this.logout}>logout</button>
                    </header>
                    <div id="timelines-menu">
                        <Timelines currentTimeline={this.state.currentTimeline} timelines={this.state.user.timelines}/>
                    </div>
                    <RouteHandler/>
                </div>
            );
        }

    });

    module.exports = HistoryOfApp;
}());
