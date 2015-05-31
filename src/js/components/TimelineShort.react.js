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

        removeTimeline: function () {
            timelineActions.remove(this.props.timeline);
        },

        render: function() {
            var timeline = this.props.timeline;
            var title = timeline.id ?
                (<Link to="timeline" params={{id: timeline.id}}>{timeline.title}</Link>) :
                (<span>{timeline.title}</span>);

            return (
                <li>
                    {title}
                    <button onClick={this.removeTimeline}>x</button>
                </li>
            );
        }
    });

    module.exports = TimelineShort;
}());
