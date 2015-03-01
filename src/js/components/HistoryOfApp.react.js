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

        create: function (eventType, date) {
            this.setState({ editedEvent: { type: eventType, date: date || this.state.defaultDate } });
        },

        edit: function (event) {
            this.setState({ editedEvent: event });
        },

        render: function () {
            return (
                <div>
                    <Timeline
                        events={this.state.events}
                        onRequestCreation={this.create}
                        onRequestEdition={this.edit}/>

                    <div id="edit-section">
                        <EventForm event={this.state.editedEvent} onEventCreated={this.onEventCreated}/>
                        <AddButton onRequestCreation={this.create}/>
                    </div>
                </div>
            );
        }

    });

    module.exports = HistoryOfApp;
}())
