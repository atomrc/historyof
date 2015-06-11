/*global require, module */
(function () {
    "use strict";

    var React = require("react"),
        Router = require("react-router"),
        Link = require("react-router").Link,
        userActions = require("../actions/userActions"),
        tokenActions = require("../actions/tokenActions"),
        tokenStore = require("../stores/tokenStore");

    module.exports = React.createClass({

        mixins: [Router.Navigation],

        getInitialState: function () {
            return {
                user: {},
                token: tokenStore.get()
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
        },

        render: function () {

            var user = this.state.user;

            return (
                <div>
                    <form onSubmit={this.createUser}>
                        <input placeholder="pseudo" name="pseudo" value={user.pseudo} onChange={this.onChange}/>
                        <input placeholder="firstname" name="firstname" value={user.firstname} onChange={this.onChange}/>
                        <input placeholder="lastname" name="lastname" value={user.lastname} onChange={this.onChange}/>
                        <input placeholder="login" name="login" value={user.login} onChange={this.onChange}/>
                        <input placeholder="password" name="password" type="password" value={user.password} onChange={this.onChange}/>
                        <input type="submit" value="Submit"/>
                    </form>

                    <Link to="home">login</Link>
                </div>
            );
        }
    });

}());
