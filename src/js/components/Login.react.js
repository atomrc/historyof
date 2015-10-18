/*global require, module */
(function () {
    "use strict";

    var React = require("react"),
        ReactDom = require("react-dom"),
        Link = require("react-router").Link,
        userActions = require("../actions/userActions");

    var Login = React.createClass({

        getInitialState: function () {
            return {
                user: {},
                canSubmit: false
            };
        },

        login: function (e) {
            e.preventDefault();
            userActions.login(this.state.user.login, this.state.user.password);
        },

        onChange: function (e) {
            this.state.user[e.target.name] = e.target.value;
            this.state.canSubmit = ReactDom.findDOMNode(this.refs.loginForm).checkValidity();
            this.setState(this.state);
        },

        render: function () {

            var user = this.state.user;

            return (
                <div id="login">
                    <h1>HistoryOf</h1>
                    <div id="login-form" className="soft-box">
                        <form onSubmit={this.login} ref="loginForm">
                            <input
                                type="email"
                                placeholder="login"
                                name="login"
                                value={user.login}
                                onChange={this.onChange}
                                required/>

                            <input
                                placeholder="password"
                                name="password"
                                type="password"
                                value={user.password}
                                onChange={this.onChange}
                                required/>

                            <input type="submit" value="Login" disabled={!this.state.canSubmit}/>
                        </form>

                        <Link to="/register">register</Link>
                    </div>
                </div>
            );
        }
    });

    module.exports = Login;

}());
