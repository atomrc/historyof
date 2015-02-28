(function () {
    "use strict";
    var React = require("react"),
        Timeline = require("./Timeline.react"),
        EventForm = require("./EventForm.react"),
        AddButton = require("./AddButton.react"),
        eventStore = require("../stores/eventStore");

    /**
     * Will handle and display all the event of the timeline
     * Is also responsible for the global state of the application
     *
     * @return {undefined}
     */
    var HistoryOfApp = React.createClass({

        getInitialState: function () {
            return {
                editedEvent: {},
                events: eventStore.getAll(),
                defaultDate: new Date()
            };
        },

        onEventsChange: function () {
            this.setState({ events: eventStore.getAll() });
        },

        componentDidMount: function() {
            eventStore.addChangeListener(this.onEventsChange);
        },

        componentWillUnmount: function () {
            eventStore.removeChangeListener(this.onEventsChange);
        },

        onEventCreated: function (newEvent) {
            this.setState({defaultDate: newEvent.date, editedEvent: {}});
        },

        onRequestCreation: function (eventType) {
            this.setState({ editedEvent: { type: eventType, date: this.state.defaultDate } });
        },

        render: function () {
            return (
                <div>
                    <Timeline events={this.state.events}/>
                    <div id="edit-section">
                        <EventForm event={this.state.editedEvent} onEventCreated={this.onEventCreated}/>
                        <AddButton onRequestCreation={this.onRequestCreation}/>
                    </div>
                </div>
            );
        }

    });

    module.exports = HistoryOfApp;
}())
