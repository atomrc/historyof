/*global require, module*/
(function () {
    "use strict";
    var React = require("react"),
        Router = require("react-router"),
        Link = require("react-router").Link,
        RouteHandler = Router.RouteHandler,
        Timelines = require("../Timelines.react"),
        timelineStore = require("../../stores/timelineStore"),
        currentTimelineStore = require("../../stores/currentTimelineStore"),
        userStore = require("../../stores/userStore"),
        userActions = require("../../actions/userActions");

    /**
     * Will handle and display all the event of the timeline
     * Is also responsible for the global state of the application
     *
     * @return {undefined}
     */
    module.exports = React.createClass({

        mixins: [Router.Navigation],

        getInitialState: function () {
            return {
                user: userStore.get(),
                timelines: timelineStore.get()
            };
        },

        componentWillMount: function () {
            userStore.addChangeListener(this.modelChange);
            timelineStore.addChangeListener(this.modelChange);

            userActions.getUser();
        },

        componentWillUnmount: function () {
            timelineStore.removeChangeListener(this.modelChange);
            userStore.removeChangeListener(this.modelChange);
        },

        modelChange: function () {
            this.setState(this.getInitialState());
            if (this.state.user) {
                this.transitionTo("timeline", { id: this.state.user.timelines[0].id });
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
                        <Link to="home">HistoryOf </Link>
                        <span className="user">{this.state.user.firstname}</span>
                        <button onClick={this.logout}>logout</button>
                    </header>
                    <RouteHandler/>
                </div>
            );
        }

    });

}());
