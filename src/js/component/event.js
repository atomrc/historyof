(function () {
    "use strict";
    var React = require("react");

    var Event = React.createClass({
        getInitialState: function () {
            return this.props;
        },

        componentDidMount: function() {
            document.addEventListener("eventUpdated", this.updateEvent);
        },

        componentWillUnmount: function () {
            document.removeEventListener("eventUpdated", this.updateEvent);
        },

        edit: function () {
            document.dispatchEvent(new CustomEvent("eventEdited", { detail: this.state.event }));
        },

       remove: function () {
            document.dispatchEvent(new CustomEvent("eventRemoved", { detail: this.state.event }));
        },

        updateEvent: function (e) {
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
