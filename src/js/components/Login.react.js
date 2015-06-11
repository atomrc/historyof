/*global require, module */
(function () {
    "use strict";

    var React = require("react"),
        Link = require("react-router").Link,
        userActions = require("../actions/userActions");

    var Login = React.createClass({

        getInitialState: function () {
            return {
                user: {}
            };
        },

        login: function (e) {
            e.preventDefault();
            userActions.login(this.state.user.login, this.state.user.password);
        },

        onChange: function (e) {
            this.state.user[e.target.name] = e.target.value;
            this.setState(this.state);
        },

        render: function () {

            var user = this.state.user;

            return (
                <div>
                    <form onSubmit={this.login}>
                        <input placeholder="login" name="login" value={user.login} onChange={this.onChange}/>
                        <input placeholder="password" name="password" type="password" value={user.password} onChange={this.onChange}/>
                        <input type="submit" value="Submit"/>
                    </form>

                    <Link to="register">register</Link>
                </div>
            );
        }
    });

    module.exports = Login;

}());
