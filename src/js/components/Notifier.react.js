/*global module, require*/
"use strict";
var React = require("react"),
    ReactCSSTransitionGroup = require("react-addons-css-transition-group");

var Notif = React.createClass({
    componentDidMount: function () {
        setTimeout(() => {
            this.props.onMessageSeen(this.props.message);
        }, 5000);
    },

    render: function () {
        var message = this.props.message;
        return (<div className={"notif " + message.type}>{message.message}</div>);
    }
});

var Notifier = ({messages, onMessageSeen}) => {
    return (
        <div id="app-notifier">
            <ReactCSSTransitionGroup
                transitionName="fade-from-top"
                transitionAppear={true}
                transitionAppearTimeout={700}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}>
                {messages.map(message => (<Notif key={message.id} message={message} onMessageSeen={onMessageSeen} />))}
            </ReactCSSTransitionGroup>
        </div>
    )
};

Notifier.propTypes = {
    messages: React.PropTypes.array.isRequired,
    onMessageSeen: React.PropTypes.func.isRequired
};

module.exports = Notifier;
