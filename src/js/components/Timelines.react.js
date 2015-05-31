/*global require, module*/
(function () {
    "use strict";
    var React = require("react"),
        TimelineShort = require("./TimelineShort.react");

    var Timelines = React.createClass({

        render: function () {
            var timelines = this.props.timelines.map(function (timeline) {
                return (
                    <TimelineShort timeline={timeline} key={timeline.id || timeline.frontId}/>
                );
            });

            return (
                <div>
                    <ul className="timeline-list">{timelines}</ul>
                </div>
            );
        }

    });

    module.exports = Timelines;
}());
