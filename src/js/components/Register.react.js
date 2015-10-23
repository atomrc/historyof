/*global require, module */
(function () {
    "use strict";

    var React = require("react"),
        Router = require("react-router"),
        Link = require("react-router").Link,
        AsyncValidatedInput = require("./AsyncValidatedInput.react"),
        hapi = require("../api/historyOfApi"),
        userActions = require("../actions/userActions"),
        tokenActions = require("../actions/tokenActions"),
        tokenStore = require("../stores/tokenStore");

    module.exports = React.createClass({

        mixins: [Router.History],

        getInitialState: function () {
            return {
                user: {},
                token: tokenStore.get(),
                canSubmit: false
            };
        },

        componentWillMount: function () {
            tokenStore.addChangeListener(this.tokenChange);

            tokenActions.getToken();
        },

        componentWillUnmount: function () {
            tokenStore.removeChangeListener(this.tokenChange);
        },

        tokenChange: function () {
            this.setState(this.getInitialState());
            if (this.state.token) {
                this.history.pushState(null, "#/");
            }
        },

        createUser: function (e) {
            e.preventDefault();
            userActions.create(this.state.user);
        },

        onChange: function (e) {
            this.state.user[e.target.name] = e.target.value;
            this.setState(this.state);
            this.checkValidity();
        },

        checkValidity: function () {
            this.setState({
                canSubmit: React.findDOMNode(this.refs.registerForm).checkValidity()
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

                            <input type="submit" value="Submit" disabled={!this.state.canSubmit}/>
                        </form>

                        <Link to="/">login</Link>
                    </div>
                </div>
            );
        }
    });

}());
