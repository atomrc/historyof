/*global require, module*/
var React = require("react"),
    Component = React.Component,
    Container = require("flux/utils").Container,
    Router = require("react-router"),
    Link = Router.Link,
    Login = require("../Login.react"),
    userActions = require("../../actions/userActions"),
    storeFactory = require("../../stores/storeFactory");

var tokenStore = storeFactory.get("tokenStore"),
    userStore = storeFactory.get("userStore");

class AppContainer extends Component {

    constructor() {
        userActions.getUser();
        super();
    }

    static getStores() {
        return [tokenStore, userStore];
    }

    static calculateState() {
        return {
            token: tokenStore.get(),
            user: userStore.get()
        };
    }

    logout() {
        userActions.logout();
    }

    render() {
        var {token, user} = this.state;

        if (!token) {
            return (<Login/>);
        }

        if (!user) {
            return (<div>loading ...</div>);
        }

        return (
            <div id="app">
                <header id="app-header">
                    <Link to="/me"><i className="fa fa-book"></i> <span className="user">{user.pseudo}</span></Link>
                    <button className="logout" onClick={this.logout}><i className="fa fa-power-off"></i></button>
                </header>
                {React.cloneElement(this.props.children, { user: user })}
            </div>
        );
    }
}

module.exports = Container.create(AppContainer);
