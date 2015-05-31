/*global require, module*/

(function () {
    "use strict";
    var React = require("react"),
        timelineActions = require("../actions/timelineActions"),
        Link = require("react-router").Link;

    /**
     * Will handle and display all the event of the timeline
     *
     * @return {undefined}
     */
    var TimelineShort = React.createClass({

        getInitialState: function () {
            return {
                timeline: {},
                edit: false
            };
        },

        removeTimeline: function () {
            timelineActions.remove(this.props.timeline);
        },

        editTimeline: function () {
            this.setState({ timeline: this.props.timeline, edit: true });
        },

        updateTimeline: function () {
            timelineActions.update(this.props.timeline.id, this.state.timeline);
            this.setState(this.getInitialState());
        },

        onChange: function (e) {
            this.setState({ timeline: { title: e.target.value } });
        },

        render: function() {
            var timeline = this.props.timeline;
            var title = timeline.id ?
                (<Link to="timeline" params={{id: timeline.id}}>{timeline.title}</Link>) :
                (<span>{timeline.title}</span>);

            title = this.state.edit ?
                (<input value={this.state.timeline.title} onChange={this.onChange}/>) :
                title;

            var actions = this.state.edit ?
                (<button onClick={this.updateTimeline}>save</button>) :
                (
                <span className="actions">
                    <button onClick={this.removeTimeline}>x</button>
                    <button onClick={this.editTimeline}>e</button>
                </span>
                );

            return (
                <li className="timeline-card">
                    {title}
                    {actions}
                </li>
            );
        }
    });

    module.exports = TimelineShort;
}());
