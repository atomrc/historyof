/*global require, module*/
var React = require("react"),
    Router = require("react-router"),
    storeFactory = require("../../stores/storeFactory");

var listenerToken;
var tokenStore = storeFactory.get("tokenStore");

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
        listenerToken = tokenStore.addListener(this.onChange);
        this.onChange();
    },

    componentWillUnmount: function () {
        listenerToken.remove();
    },

    render: function () {
        //if no token is provided then show the login form
        return (<div>{this.props.children}</div>);
    }

});
