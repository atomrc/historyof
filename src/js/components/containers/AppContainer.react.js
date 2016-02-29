/*global require, module*/
var React = require("react"),
    connect = require("react-redux").connect,
    userActions = require("../../actions/userActions"),
    storyActions = require("../../actions/storyActions"),
    systemActions = require("../../actions/systemActions"),
    Notifier = require("../Notifier.react"),
    Login = require("../Login.react");


function getContent(props) {
    let {token, user, systemMessages, dispatch, children} = props;
    if (!token) {
        var loginErrors = systemMessages
            .filter(message => message.type === "error" && message.context === "login");

        return (<Login errors={loginErrors} onLogin={(login, password) => dispatch(userActions.login(login, password))}/>);
    }

    if (!user.id) {
        dispatch(userActions.getUser(token));
        return (<span>Loading...</span>);
    }

    return (
            <div
                id="app"
                onDrop={(e) => { e.preventDefault(); e.stopPropagation(); dispatch(storyActions.importFromFile(token, e.dataTransfer.files[0])); }}
                onDragOver={e => { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy'; }}
            >
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
}

var AppContainer = (props) => {
    var content = getContent(props);
    return (
        <div id="global-container">
            <Notifier
                onMessageSeen={message => props.dispatch(systemActions.messageSeen(message))}
                messages={props.systemMessages.filter(message => message.context === "global")} />
            {content}
        </div>
    );
};

module.exports = connect(state => state)(AppContainer);
