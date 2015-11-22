/*global require, module */
"use strict";
var React = require("react"),
    Entry = require("./Entry.react");

var Month = (props) => {
    let { month, events } = props;
    var nodes = events
        .map(function (event) {
            return (
                <Entry {...props} event={event} key={event.id}/>
            );
        });

    return (
        <div>
            <div className="month">
                {month}
                <div style={{clear: "both"}}></div>
            </div>
            <div className="soft-box">{nodes}</div>
        </div>
    );
};

module.exports = Month;
