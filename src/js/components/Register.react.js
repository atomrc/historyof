/*global require, module */
(function () {
    "use strict";

    var React = require("react"),
        Router = require("react-router"),
        Link = require("react-router").Link,
        UserLoginInput = require("./UserLoginInput.react"),
        userActions = require("../actions/userActions"),
        tokenActions = require("../actions/tokenActions"),
        tokenStore = require("../stores/tokenStore");

    module.exports = React.createClass({

        mixins: [Router.Navigation],

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
                this.transitionTo("home");
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

        render: function () {

            var user = this.state.user;

            return (
                <div id="login">
                    <h1>HistoryOf</h1>
                    <div id="login-form" className="soft-box">
                        <form onSubmit={this.createUser} ref="registerForm">
                            <input
                                placeholder="pseudo"
                                name="pseudo"
                                value={user.pseudo}
                                onChange={this.onChange}
                                />

                            <UserLoginInput
                                name="login"
                                value={user.login}
                                onValid={this.checkValidity}
                                onInvalid={this.checkValidity}
                                onChange={this.onChange}/>

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
                                value={user.passwordConfirmation}
                                onChange={this.onChange}
                                />

                            <input type="submit" value="Submit" disabled={!this.state.canSubmit}/>
                        </form>

                        <Link to="home">login</Link>
                    </div>
                </div>
            );
        }
    });

}());
