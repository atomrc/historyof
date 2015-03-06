(function () {
    "use strict";
    var React = require("react"),
        eventTypes = require("./../config/eventTypes");

    var EventsStats = React.createClass({

        render: function () {
            var groupedEvents = this
                .props
                .events
                .sort(function (e1, e2) {
                    if (e1.type === e2.type) { return 0; }
                    return e1.type < e2.type ? -1 : 1;
                })
                .reduce(function (obj, e) {
                    var key = e.type;
                    obj[key] = obj[key] ? obj[key] : [];
                    obj[key].push(e);
                    return obj;
                }, {});

            var stats = [];
            for (var i in groupedEvents) {
                stats.push((
                    <span key={"stats-" + i}>
                        {groupedEvents[i].length} <i className={"fa " + eventTypes.getType(i).icon}></i>&nbsp;
                    </span>
                ));
            }

            return (
                <div className="events-stats">{stats}</div>
            );
        }
    });

    module.exports = EventsStats;
}());
