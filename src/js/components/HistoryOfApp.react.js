/*global require, module*/
(function () {
    "use strict";
    var React = require("react"),
        Timeline = require("./Timeline.react"),
        EventForm = require("./EventForm.react"),
        AddButton = require("./AddButton.react"),
        userStore = require("../stores/userStore"),
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
                events: eventStore.getAll(),
                hasToken: userStore.hasToken()
            };
        },

        onChange: function () {
            this.setState(this.getInitialState());
        },

        componentDidMount: function() {
            eventStore.addChangeListener(this.onChange);
            userStore.addChangeListener(this.onChange);
        },

        componentWillUnmount: function () {
            eventStore.removeChangeListener(this.onChange);
            userStore.removeChangeListener(this.onChange);
        },

        render: function () {
            if (!this.state.hasToken) {
                return (<span>you are not logged. Please log in</span>);
            }

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
}());
