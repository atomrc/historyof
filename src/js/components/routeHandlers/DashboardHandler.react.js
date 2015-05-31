/*global require, module*/
(function () {
    "use strict";
    var React = require("react"),
        userStore = require("../../stores/userStore"),
        timelineStore = require("../../stores/timelineStore"),
        TimelineShort = require("../TimelineShort.react"),
        timelineActions = require("../../actions/timelineActions");

    var DashboardHandler = React.createClass({

        getInitialState: function () {
            return {
                timelines: timelineStore.get(),
                newTimeline: {}
            };
        },

        componentWillMount: function () {
            timelineStore.addChangeListener(this.timelinesChange);
        },

        componentWillUnmount: function () {
            timelineStore.removeChangeListener(this.timelinesChange);
        },

        timelinesChange: function () {
            this.setState(this.getInitialState());
        },

        onChange: function (e) {
            var changes = { newTimeline: this.state.newTimeline };
            changes.newTimeline[e.target.name] = e.target.value;
            this.setState(changes);
        },

        createTimeline: function (e) {
            e.preventDefault();
            timelineActions.create(this.state.newTimeline);
        },

        render: function () {
            var timelines = this.state.timelines.map(function (timeline) {
                return (
                    <TimelineShort timeline={timeline} key={timeline.id || timeline.frontId}/>
                );
            });

            return (
                <div>
                    <ul>{timelines}</ul>
                    <form onSubmit={this.createTimeline}>
                        <input name="title" value={this.state.newTimeline.title} onChange={this.onChange}/>
                    </form>
                </div>
            );
        }

    });

    module.exports = DashboardHandler;
}());
