/*global require, module*/
(function () {
    "use strict";
    var React = require("react"),
        Router = require("react-router"),
        tokenStore = require("../../stores/tokenStore");

    module.exports = React.createClass({

        mixins: [Router.History],

        getInitialState: function () {
            return {
                token: tokenStore.get()
            };
        },

        onChange: function () {
            this.setState(this.getInitialState(), () => {
                return this.state.token ?
                    this.history.pushState(null, "/me") :
                    null;
            });
        },

        componentWillMount: function() {
            tokenStore.addChangeListener(this.onChange);
            this.onChange();
        },

        componentWillUnmount: function () {
            tokenStore.removeChangeListener(this.onChange);
        },

        render: function () {
            //if no token is provided then show the login form
            return (<div>{this.props.children}</div>);
        }

    });

}());
