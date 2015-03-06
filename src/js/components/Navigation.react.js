(function () {
    "use strict";
    var React = require("react"),
        EventsStats = require("./EventsStats.react"),
        Year = require("./Year.react");

    /**
     * Will handle and display all the event of the timeline
     *
     * @return {undefined}
     */
    var Navigation = React.createClass({

        render: function() {
            var yearNodes = [],
                groupedEvents = this
                    .props
                    .events
                    .sort(function (e1, e2) {
                        if (e1.date === e2.date) { return 0; }
                        return e1.date > e2.date ? -1 : 1;
                    })
                    .reduce(function (obj, e) {
                        var key = e.date.getFullYear().toString();
                        if (!obj[key]) { obj[key] = [] }
                        obj[key].push(e);
                        return obj;
                    }, {});

            for (var i in groupedEvents) {
                yearNodes.push((
                    <div key={"year-" + i} className="nav-element">
                        <a href={"#years/" + i}>{i}</a>
                        <EventsStats events={groupedEvents[i]}/>
                    </div>
                ));
            }

            return (
                <div className="nav-container">
                    <nav className="soft-box">{yearNodes}</nav>
                </div>
            );
        }
    });

    module.exports = Navigation;
}());
