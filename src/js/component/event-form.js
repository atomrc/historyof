(function () {
    "use strict";
    var React = require("react");

    var EventForm = React.createClass({
        getInitialState: function() {
            return { style: { display: "none" }, event: {} };
        },

        saveEvent: function (e) {
            e.preventDefault();
            var event = this.state.event;
            var eventName = event.id ? 
                "eventUpdated" :
                "eventCreated";

            event.date = new Date(event.date);

            document.dispatchEvent(new CustomEvent(eventName, { detail: event }));
            this.replaceState(this.getInitialState());
        },

        editEvent: function (e) {
            this.setState({ style: { display: "block" },  event: e.detail });
        },

        updateEvent: function (event) {
            var stateEvent = this.state.event;
            stateEvent[event.target.name] = event.target.value;
            this.setState(stateEvent);
        },

        componentDidMount: function() {
          document.addEventListener("eventEdited", this.editEvent);
        },

        render: function () {
            return (
                <form style={this.state.style} onSubmit={this.saveEvent}>
                    <input type="text" name="title" value={this.state.event.title} onChange={this.updateEvent}/>
                    <input type="date" name="date" value={this.state.event.date} onChange={this.updateEvent}/>
                    <textarea name="text" value={this.state.event.text} onChange={this.updateEvent}/>
                    <button>add</button>
                </form>
            );
        }
    });

    module.exports = EventForm;
}());
