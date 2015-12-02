/*global require, module*/
var React = require("react"),
    connect = require("react-redux").connect,
    userActions = require("../../actions/userActions"),
    Login = require("../Login.react");

var AppContainer = (props) => {
    let {token, user, errors, dispatch, children} = props;
    if (!token) {
        return (<Login error={errors.login} onLogin={(login, password) => dispatch(userActions.login(login, password))}/>);
    }

    if (!user.id) {
        dispatch(userActions.getUser(token));
        return (<span>Loading...</span>);
    }

    return (
            <div id="app">
                <header id="app-header">
                    <i className="fa fa-book"></i> <span className="user">{user.pseudo}</span>
                    <button className="logout" onClick={() => {
                        dispatch(userActions.logout())
                    }}>
                        <i className="fa fa-power-off"></i>
                    </button>
                </header>
                {children}
            </div>
        );
};

module.exports = connect(state => state)(AppContainer);
