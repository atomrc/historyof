(function () {
    "use strict";
    var React = require("react"),
        eventManager = require("../event/manager"),
        eventEvents = require("../event/event-events");

    var EventForm = React.createClass({

        getInitialState: function() {
            return { style: { display: "none" }, event: {} };
        },

        setEventListeners: function (up)
        {
            var listeners = {};
            listeners[eventEvents.request.update] = this.edit;
            listeners[eventEvents.request.create] = this.create;
            eventManager.setEventListeners(listeners, up);
        },

        componentDidMount: function() {
            this.setEventListeners(true);
        },

        componentWillUnmount: function () {
            this.setEventListeners(false);
        },

        resetState: function () {
            this.replaceState(this.getInitialState());
        },

        create: function (e) {
            this.setState({ style: { display: "block" },  event: { type: e.detail.type, date: new Date() }});
        },

        edit: function (e) {
            this.setState({ style: { display: "block" },  event: e.detail });
        },

        save: function (e) {
            e.preventDefault();
            var event = this.state.event;
            var eventName = event.id ? 
                eventEvents.updated :
                eventEvents.created;

            event.date = new Date(event.date);

            eventManager.dispatchEvent(eventName, event);
            this.resetState();
        },

        cancel: function (e) {
            this.resetState();
        },

        updateState: function (event) {
            var stateEvent = this.state.event;
            stateEvent[event.target.name] = event.target.value;
            this.setState(stateEvent);
        },

        render: function () {
            return (
                <form style={this.state.style} onSubmit={this.save}>
                    <input type="text" name="title" value={this.state.event.title} onChange={this.updateState}/>
                    <br/>
                    <input type="date" name="date" value={this.state.event.date} onChange={this.updateState}/>
                    <br/>
                    <textarea name="text" value={this.state.event.text} onChange={this.updateState}/>
                    <br/>
                    <button>add</button>
                    <button type="button" onClick={this.cancel}>cancel</button>
                </form>
            );
        }
    });

    module.exports = EventForm;
}());
