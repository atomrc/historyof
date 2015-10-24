/*global require, module*/
(function () {
    "use strict";
    var React = require("react"),
        Router = require("react-router"),
        Login = require("../../components/Login.react"),
        tokenStore = require("../../stores/tokenStore");

    module.exports = React.createClass({

        mixins: [Router.History],

        getInitialState: function () {
            return {
                token: tokenStore.get()
            };
        },

        onChange: function () {
            this.setState(this.getInitialState());
        },

        componentWillMount: function() {
            tokenStore.addChangeListener(this.onChange);
        },

        componentWillUnmount: function () {
            tokenStore.removeChangeListener(this.onChange);
        },

        render: function () {
            //if no token is provided then show the login form
            if (!this.state.token) {
                return (<Login/>);
            }
            return (<div>{this.props.children}</div>);
        }

    });

}());
