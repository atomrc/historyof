/*global require, module */
"use strict";
var React = require("react"),
    Story = require("./Story.react");

var Month = (props) => {
    let { month, stories } = props;
    var nodes = stories
        .map(function (story) {
            return (
                <Story {...props} story={story} key={story.id}/>
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
