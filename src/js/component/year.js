(function () {
    "use strict";
    var React = require("react"),
        Event = require("./event"),
        eventManager = require("../event/manager"),
        eventEvents = require("../event/event-events");

    var Year = React.createClass({
        getInitialState: function () {
            return { open: false };
        },

        toggle: function () {
            this.setState({ open: !this.state.open });
        },

        render: function () {
            var events = this.props.events.map(function (event) {
                return (
                    <Event event={event} key={event.id}/>
                );
            });

            var classes = this.state.open ? "toggle" : "toggle closed";

            return (
                <div>
                    <h2 onClick={this.toggle}>{this.props.year} <em>({events.length})</em></h2>
                    <div className={classes}>{events}</div>
                </div>
            );
        }
    });

    module.exports = Year;
}());
