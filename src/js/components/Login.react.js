/*global require, module */
var React = require("react"),
    ReactDom = require("react-dom"),
    Link = require("react-router").Link;

var Login = React.createClass({

    getInitialState: function () {
        return {
            user: {},
            canSubmit: false,
            submitting: false
        };
    },

    login: function (e) {
        e.preventDefault();
        this.setState({ submitting: true });
        this.props.onLogin(this.state.user.login, this.state.user.password);
    },

    onChange: function (e) {
        this.state.user[e.target.name] = e.target.value;
        this.state.canSubmit = ReactDom.findDOMNode(this.refs.loginForm).checkValidity();
        this.setState(this.state);
    },

    render: function () {
        var user = this.state.user,
            errorMessage = this.state.error ?
                (<div className="form-error">{this.state.error}</div>) :
                null;

        return (
            <div id="login">
                <h1>HistoryOf</h1>
                <div id="login-form" className="soft-box">
                    <form onSubmit={this.login} ref="loginForm">
                        {errorMessage}
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

                        <input type="submit" value={this.state.submitting ? "Loading ..." : "Login"} disabled={!this.state.canSubmit || this.state.submitting}/>
                    </form>

                    <Link to="/register">register</Link>
                </div>
            </div>
        );
    }
});

module.exports = Login;
