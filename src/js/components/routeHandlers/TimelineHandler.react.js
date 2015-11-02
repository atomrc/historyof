/*global require, module*/
var React = require("react"),
    Timeline = require("../Timeline.react"),
    eventActions = require("../../actions/eventActions"),
    eventStore = require("../../stores/eventStore");

var listenerToken;
/**
 * Will handle and display all the events of the timeline
 *
 * @return {undefined}
 */
module.exports = React.createClass({

    getInitialState: function () {
        return {
            events: eventStore.get()
        };
    },

    onChange: function () {
        this.setState(this.getInitialState());
    },

    componentWillMount: function() {
        listenerToken = eventStore.addListener(this.onChange);
        window.setTimeout(eventActions.getAll);
    },

    componentWillUnmount: function () {
        listenerToken.remove();
    },

    render: function () {
        if (!this.state.events) {
            return (<div>loading...</div>);
        }

        return (
            <Timeline user={this.props.user} events={this.state.events}/>
        );
    }

});
