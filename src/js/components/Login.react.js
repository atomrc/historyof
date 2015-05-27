(function () {
    "use strict";

    var React = require("react"),
        userActions = require("../actions/userActions");

    var Login = React.createClass({

        getInitialState: function () {
            return {
                user: {
                    login: "",
                    password: ""
                }
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
            return (
                <form onSubmit={this.login}>
                    <input name="login" value={this.state.user.login} onChange={this.onChange}/>
                    <input name="password" type="password" value={this.state.user.password} onChange={this.onChange}/>
                    <input type="submit" value="Submit"/>
                </form>
            );
        }
    });

    module.exports = Login;

}());
