/*global require, module */
"use strict";

var React = require("react"),
    Link = require("react-router").Link,
    pushState = require("redux-router").pushState,
    connect = require("react-redux").connect,
    AsyncValidatedInput = require("./AsyncValidatedInput.react"),
    hapi = require("../api/historyOfApi"),
    userActions = require("../actions/userActions");

var RegisterContainer = React.createClass({

    componentWillMount: function () {
        if (this.props.token) {
            this.props.dispatch(pushState(null, "/me"));
        }
    },

    componentWillReceiveProps: function (newProps) {
        if (newProps.token) {
            this.props.dispatch(pushState(null, "/me"));
        }
    },

    getInitialState: function () {
        return {
            user: {},
            canSubmit: false,
            submitting: false
        };
    },

    createUser: function (e) {
        e.preventDefault();
        this.setState({submitting: true});
        this.props.dispatch(userActions.create(this.state.user));
    },

    onChange: function (e) {
        this.state.user[e.target.name] = e.target.value;
        this.setState(this.state);
        this.checkValidity();
    },

    checkValidity: function () {
        var form = this.refs.registerForm;
        this.setState({
            canSubmit: form.checkValidity ? form.checkValidity() : true
        });
    },

    checkLogin: function (login) {
        return hapi
            .checkLogin(login)
            .then(function (result) {
                return result.available ? "" : login + " is already taken";
            });
    },

    checkPseudo: function (pseudo) {
        return hapi
            .checkPseudo(pseudo)
            .then(function (result) {
                return result.available ? "" : pseudo + " is already taken";
            });
    },

    render: function () {
        var user = this.state.user;

        return (
            <div id="login">
                <h1>HistoryOf</h1>
                <div id="login-form" className="soft-box">
                    <form onSubmit={this.createUser} ref="registerForm">
                        <AsyncValidatedInput
                            name="pseudo"
                            type="text"
                            placeholder="pseudo"
                            value={user.pseudo}
                            onValid={this.checkValidity}
                            onInvalid={this.checkValidity}
                            onRequestValidation={this.checkPseudo}
                            onChange={this.onChange}
                            required/>


                        <AsyncValidatedInput
                            name="login"
                            type="email"
                            placeholder="email"
                            value={user.login}
                            onValid={this.checkValidity}
                            onInvalid={this.checkValidity}
                            onRequestValidation={this.checkLogin}
                            onChange={this.onChange}
                            required/>

                        <input
                            placeholder="password"
                            name="password"
                            type="password"
                            value={user.password}
                            onChange={this.onChange}
                            required/>

                        <input
                            placeholder="confirm password"
                            name="passwordConfirmation"
                            type="password"
                            pattern={user.password}
                            value={user.passwordConfirmation}
                            onChange={this.onChange}
                            required/>

                        <input type="submit" value={this.state.submitting ? "Loading ..." : "Start Writting"} disabled={!this.state.canSubmit || this.state.submitting}/>
                    </form>

                    <Link to="/me">login</Link>
                </div>
            </div>
        );
    }
});

function select(state) {
    return {
        token: state.token
    };
}
module.exports = connect(select)(RegisterContainer);
