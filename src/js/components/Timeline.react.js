(function () {
    "use strict";
    var React = require("react"),
        Navigation = require("./Navigation.react"),
        Year = require("./Year.react");

    /**
     * Will handle and display all the event of the timeline
     *
     * @return {undefined}
     */
    var Timeline = React.createClass({

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
                    <Year
                        key={"year-" + i}
                        year={i}
                        events={groupedEvents[i]}/>
                ));
            }
            return (
                <div className="timeline table">
                    <Navigation events={this.props.events}/>
                    <div className="events-container cell">{yearNodes}</div>
                </div>
            );
        }
    });

    module.exports = Timeline;
}());
