/*global require, module*/
"use strict";
var React = require("react"),
    Month = require("./Month.react"),
    moment = require("moment");

var Year = (props) => {
    let { year, events } = props;
    var monthNodes = [],
        groupedEvents = events
            .reduce(function (obj, e) {
                var key = moment(e.date).format("MMMM");
                if (!obj[key]) { obj[key] = []; }
                obj[key].push(e);
                return obj;
            }, {});

    for (var i in groupedEvents) {
        monthNodes.push((
            <Month
                {...props}
                key={"month-" + i}
                events={groupedEvents[i]}
                month={i}
                />
        ));
    }

    return (
        <div className="year">
            <h2><a name={"years/" + year}></a>{year}</h2>
            <div>{monthNodes}</div>
        </div>
    );
};

module.exports = Year;
