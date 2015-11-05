/*global require, module*/
var React = require("react"),
    Component = React.Component,
    Container = require("flux/utils").Container,
    tokenStore = require("../../stores/storeFactory").get("tokenStore");

class GuestContainer extends Component {

    constructor(props) {
        super(props);
    }

    static getStores() {
        return [tokenStore];
    }

    static calculateState() {
        return {
            token: tokenStore.get()
        };
    }

    componentWillMount() {
        if (this.state.token) {
            this.props.history.pushState(null, "/me");
        }
    }

    componentWillUpdate(props, state) {
        if (state.token) {
            props.history.pushState(null, "/me");
        }
    }

    render() {
        return (<div>{this.props.children}</div>);
    }
}

module.exports = Container.create(GuestContainer);
