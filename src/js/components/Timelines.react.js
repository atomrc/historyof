/*global require, module*/
(function () {
    "use strict";
    var React = require("react"),
        TimelineShort = require("./TimelineShort.react");

    var Timelines = React.createClass({

        render: function () {
            var currentTimeline = this.props.currentTimeline || {};

            var timelines = this.props.timelines.map(function (timeline) {
                var className = currentTimeline.id === timeline.id ?
                    "current" :
                    "";

                return (
                    <li className={"timeline " + className} key={timeline.id || timeline.frontId}>
                        <TimelineShort timeline={timeline}/>
                    </li>
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
