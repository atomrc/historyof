/*global require, module*/
(function () {
    "use strict";
    var React = require("react"),
        Link = require("react-router").Link,
        userStore = require("../../stores/userStore"),
        userActions = require("../../actions/userActions");

    /**
     * Will display all the user's information
     *
     * @return {undefined}
     */
    module.exports = React.createClass({

        getInitialState: function () {
            return {
                user: userStore.get()
            };
        },

        componentWillMount: function () {
            userStore.addChangeListener(this.modelChange);

            userActions.getUser();
        },

        componentWillUnmount: function () {
            userStore.removeChangeListener(this.modelChange);
        },

        modelChange: function () {
            this.setState(this.getInitialState());
        },

        logout: function () {
            userActions.logout();
        },

        render: function () {

            if (!this.state.user) {
                return (<span> login in... </span>);
            }

            return (
                <div id="app">
                    <header id="app-header">
                        <Link to="home"><i className="fa fa-book"></i> <span className="user">{this.state.user.pseudo}</span></Link>
                        <button className="logout" onClick={this.logout}><i className="fa fa-power-off"></i></button>
                    </header>
                    {React.cloneElement(this.props.children, {user: this.state.user })}
                </div>
            );
        }

    });

}());
