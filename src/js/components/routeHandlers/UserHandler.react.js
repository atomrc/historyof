/*global require, module*/
var React = require("react"),
    Link = require("react-router").Link,
    userStore = require("../../stores/userStore"),
    userActions = require("../../actions/userActions");

var listenerToken;
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
        listenerToken = userStore.addListener(this.modelChange);
        window.setTimeout(userActions.getUser);
    },

    componentWillUnmount: function () {
        listenerToken.remove();
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
                    <Link to="/"><i className="fa fa-book"></i> <span className="user">{this.state.user.pseudo}</span></Link>
                    <button className="logout" onClick={this.logout}><i className="fa fa-power-off"></i></button>
                </header>
                {React.cloneElement(this.props.children, {user: this.state.user })}
            </div>
        );
    }

});
