(function () {
    "use strict";
    var React = require("react");

    var EventForm = React.createClass({
        getInitialState: function() {
            return { style: { display: "none" }, event: {} };
        },

        componentDidMount: function() {
          document.addEventListener("eventEdited", this.edit);
        },

        resetState: function () {
            this.replaceState(this.getInitialState());
        },

        edit: function (e) {
            this.setState({ style: { display: "block" },  event: e.detail });
        },

        save: function (e) {
            e.preventDefault();
            var event = this.state.event;
            var eventName = event.id ? 
                "eventUpdated" :
                "eventCreated";

            event.date = new Date(event.date);

            document.dispatchEvent(new CustomEvent(eventName, { detail: event }));
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
