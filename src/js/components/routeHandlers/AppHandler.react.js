/*global require, module*/
(function () {
    "use strict";
    var React = require("react"),
        Router = require("react-router"),
        RouteHandler = Router.RouteHandler,
        Login = require("../../components/Login.react"),
        tokenActions = require("../../actions/tokenActions"),
        tokenStore = require("../../stores/tokenStore");

    module.exports = React.createClass({

        mixins: [Router.Navigation],

        getInitialState: function () {
            return {
                token: tokenStore.get()
            };
        },

        onChange: function () {
            this.setState(this.getInitialState());
            if (this.state.token) {
                this.transitionTo("home");
            }
        },

        componentWillMount: function() {
            tokenStore.addChangeListener(this.onChange);
            //retrieve the user's stored token (if exists) before launching the app
            tokenActions.getToken();
        },

        componentWillUnmount: function () {
            tokenStore.removeChangeListener(this.onChange);
        },

        render: function () {
            //if no token is provided then show the login form
            if (!this.state.token) {
                return (<Login/>);
            }
            return (<RouteHandler/>);
        }

    });

}());
