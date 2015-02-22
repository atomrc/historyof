(function () {
    "use strict";
    var React = require("react"),
        Event = require("./event"),
        eventManager = require("../event/manager"),
        eventEvents = require("../event/event-events");

    var Year = React.createClass({
        render: function () {
            var events = this.props.events.map(function (event) {
                return (
                    <Event event={event} key={event.id}/>
                );
            });

            return (
                <div>
                    <h2>{this.props.year} <em>({events.length})</em></h2>
                    <div>{events}</div>
                </div>
            );
        }
    });

    module.exports = Year;
}());
