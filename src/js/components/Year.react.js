(function () {
    "use strict";
    var React = require("react"),
        Event = require("./Event.react"),
        moment = require("moment");

    var Year = React.createClass({
        getInitialState: function () {
            return { open: false };
        },

        toggle: function () {
            this.setState({ open: !this.state.open });
        },

        render: function () {
            var monthNodes = [],
                groupedEvents = this
                    .props
                    .events
                    .sort(function (e1, e2) {
                        if (e1.date === e2.date) { return 0; }
                        return e1.date < e2.date ? -1 : 1;
                    })
                    .reduce(function (obj, e) {
                        var key = moment(e.date).format("MMMM");
                        if (!obj[key]) { obj[key] = [] }
                        obj[key].push(e);
                        return obj;
                    }, {});

            for (var i in groupedEvents) {
                var events = groupedEvents[i].map(function (event) {
                    return (
                        <Event event={event} key={event.id || event.frontId}/>
                    );
                });

                monthNodes.push((
                    <div key={i}>
                        <div className="month">{i} ({events.length})</div>
                        <div>{events}</div>
                    </div>
                ));
            }

            var monthsNode = this.state.open ?
                (<div>{monthNodes}</div>) :
                "";

            return (
                <div className="year">
                    <h2 onClick={this.toggle}>{this.props.year} <em>({this.props.events.length})</em></h2>
                    {monthsNode}
                </div>
            );
        }
    });

    module.exports = Year;
}());
