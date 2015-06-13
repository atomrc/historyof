/*global require, module*/
(function () {
    "use strict";
    var React = require("react"),
        Router = require("react-router"),
        Link = require("react-router").Link,
        RouteHandler = Router.RouteHandler,
        userStore = require("../../stores/userStore"),
        userActions = require("../../actions/userActions");

    /**
     * Will display all the user's information
     *
     * @return {undefined}
     */
    module.exports = React.createClass({

        mixins: [Router.Navigation],

        getInitialState: function () {
            return {
                user: userStore.get()
            };
        },

        componentWillMount: function () {
            userStore.addChangeListener(this.modelChange);

            userActions.getUser();
        },

        componentWillUnmount: function () {
            userStore.removeChangeListener(this.modelChange);
        },

        modelChange: function () {
            this.setState(this.getInitialState());
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
                        <Link to="home">HistoryOf <span className="user">{this.state.user.pseudo}</span></Link>
                        <button onClick={this.logout}>logout</button>
                    </header>
                    <RouteHandler/>
                </div>
            );
        }

    });

}());
