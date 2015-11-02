/*global require, module*/
var React = require("react"),
    Router = require("react-router"),
    tokenStore = require("../../stores/tokenStore");

var listenerToken;
module.exports = React.createClass({

    mixins: [Router.History],

    getInitialState: function () {
        return {
            token: tokenStore.get()
        };
    },

    onChange: function () {
        this.setState(this.getInitialState(), () => {
            return !this.state.token ?
                this.history.pushState(null, "/login") :
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
