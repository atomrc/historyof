/*global require, module*/
(function () {
    "use strict";
    var React = require("react"),
        Month = require("./Month.react"),
        moment = require("moment");

    var Year = React.createClass({
        render: function () {
            var monthNodes = [],
                groupedEvents = this
                    .props
                    .events
                    .reduce(function (obj, e) {
                        var key = moment(e.date).format("MMMM");
                        if (!obj[key]) { obj[key] = []; }
                        obj[key].push(e);
                        return obj;
                    }, {});

            for (var i in groupedEvents) {
                monthNodes.push((
                    <Month
                        key={"month-" + i}
                        events={groupedEvents[i]}
                        month={i}
                        />
                ));
            }

            return (
                <div className="year">
                    <h2><a name={"years/" + this.props.year}></a>{this.props.year}</h2>
                    <div>{monthNodes}</div>
                </div>
            );
        }
    });

    module.exports = Year;
}());
