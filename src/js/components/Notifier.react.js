/*global module, require*/
"use strict";
var React = require("react");

var Notif = React.createClass({
    render: function () {
        var message = this.props.message;
        return (<div className={"notif " + message.type}>{message.message}</div>);
    }
});

var Notifier = ({messages}) => {
    if (!messages.length) {
        return (<span></span>);
    }

    return (
        <div id="app-notifier">
            {messages.map(message => (<Notif key={message.id} message={message} />))}
        </div>
    )
};

Notifier.propTypes = {
    messages: React.PropTypes.array.isRequired
};

module.exports = Notifier;
