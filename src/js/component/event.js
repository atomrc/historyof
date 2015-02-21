(function () {
    "use strict";
    var React = require("react");

    var Event = React.createClass({
        getInitialState: function () {
            return this.props;
        },

        componentDidMount: function() {
          document.addEventListener("eventUpdated", this.eventUpdated);
        },

        componentWillUnmount: function () {
            document.removeEventListener("eventUpdated");
        },

        editEvent: function () {
            document.dispatchEvent(new CustomEvent("eventEdited", { detail: this.state.event }));
        },

        eventUpdated: function (e) {
            var updatedEvent = e.detail;
            if (updatedEvent.id === this.state.event.id) {
                this.setState({ event: updatedEvent });
            }
        },

        render: function () {
            return (
                <div onClick={this.editEvent}>
                    <h2>{this.state.event.title}</h2>
                    <em>{this.state.event.date.toDateString()}</em>
                    <p dangerouslySetInnerHTML={{__html: this.state.event.text.replace(/\n/g, "<br>")}}></p>
                </div>
            );
        }
    });

    module.exports = Event;
}());
