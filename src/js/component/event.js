(function () {
    "use strict";
    var React = require("react"),
        eventManager = require("../event/manager"),
        eventEvents = require("../event/event-events");

    var Event = React.createClass({
        getInitialState: function () {
            return this.props;
        },

        setEventListeners: function (up)
        {
            var listeners = {};
            listeners[eventEvents.updated] = this.update;
            eventManager.setEventListeners(listeners, up);
        },

        componentDidMount: function() {
          this.setEventListeners(true);
        },

        componentWillUnmount: function () {
            this.setEventListeners(false);
        },

        edit: function () {
            eventManager.dispatchEvent(eventEvents.request.update, this.state.event);
        },

        remove: function () {
            eventManager.dispatchEvent(eventEvents.request.remove, this.state.event);
        },

        update: function (e) {
            var updatedEvent = e.detail;
            if (updatedEvent.id === this.state.event.id) {
                this.setState({ event: updatedEvent });
            }
        },

        render: function () {
            return (
                <div>
                    <a href="#" onClick={this.edit}>edit</a>&nbsp;
                    <a href="#" onClick={this.remove}>delete</a>
                    <h2>{this.state.event.title}</h2>
                    <em>{this.state.event.date.toDateString()}</em>
                    <p dangerouslySetInnerHTML={{__html: this.state.event.text.replace(/\n/g, "<br>")}}></p>
                </div>
            );
        }
    });

    module.exports = Event;
}());
