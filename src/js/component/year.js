(function () {
    "use strict";
    var React = require("react"),
        Event = require("./event"),
        moment = require("moment"),
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
            var monthHash = {},
                months = [];
            this.props.events.forEach(function (event) {
                var key = moment(event.date).format("MMMM");
                if (!monthHash[key]) {
                    monthHash[key] = [];
                }
                monthHash[key].push(event);
            });

            for (var i in monthHash) {
                var events = monthHash[i].map(function (event) {
                    return (
                        <Event event={event} key={event.id}/>
                    );
                });

                months.push((
                    <div key={i}>
                        <div className="month">{i} ({events.length})</div>
                        <div>{events}</div>
                    </div>
                ));
            }


            var classes = this.state.open ? "toggle" : "toggle closed";

            return (
                <div>
                    <h2 onClick={this.toggle}>{this.props.year} <em>({this.props.events.length})</em></h2>
                    <div className={classes}>{months}</div>
                </div>
            );
        }
    });

    module.exports = Year;
}());
