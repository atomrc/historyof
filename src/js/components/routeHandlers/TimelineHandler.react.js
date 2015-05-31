/*global require, module*/
(function () {
    "use strict";
    var React = require("react"),
        timelineActions = require("../../actions/timelineActions"),
        Timeline = require("../Timeline.react"),
        EventForm = require("../EventForm.react"),
        AddButton = require("../AddButton.react"),
        eventStore = require("../../stores/eventStore");

    /**
     * Will handle and display all the events of the timeline
     *
     * @return {undefined}
     */
    var HistoryOfApp = React.createClass({

        getInitialState: function () {
            return {
                events: eventStore.get()
            };
        },

        onChange: function () {
            this.setState(this.getInitialState());
        },

        componentWillMount: function() {
            eventStore.addChangeListener(this.onChange);

            timelineActions.get(this.props.params.id);
        },

        componentWillUnmount: function () {
            eventStore.removeChangeListener(this.onChange);
        },

        render: function () {
            if (!this.state.events) {
                return (<div>loading...</div>);
            }

            return (
                <div>
                    <Timeline timelineId={this.props.params.id} events={this.state.events}/>
                    <div id="edit-section">
                        <EventForm timelineId={this.props.params.id}/>
                        <AddButton timelineId={this.props.params.id}/>
                    </div>
                </div>
            );
        }

    });

    module.exports = HistoryOfApp;
}());
