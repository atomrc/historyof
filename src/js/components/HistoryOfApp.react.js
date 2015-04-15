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
                events: eventStore.getAll()
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

        render: function () {
            return (
                <div id="historyof">
                    <Timeline events={this.state.events}/>
                    <div id="edit-section">
                        <EventForm/>
                        <AddButton/>
                    </div>
                </div>
            );
        }

    });

    module.exports = HistoryOfApp;
}())
