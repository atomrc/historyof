/*global require, module*/
"use strict";
var React = require("react"),
    Month = require("./Month.react"),
    moment = require("moment");

var Year = (props) => {
    let { year, stories } = props;
    var monthNodes = [],
        groupedStories = stories
            .reduce(function (obj, e) {
                var key = moment(e.date).format("MMMM");
                if (!obj[key]) { obj[key] = []; }
                obj[key].push(e);
                return obj;
            }, {});

    for (var i in groupedStories) {
        monthNodes.push((
            <Month
                {...props}
                key={"month-" + i}
                stories={groupedStories[i]}
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
