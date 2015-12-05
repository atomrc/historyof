/*global require, module */
"use strict";
var React = require("react"),
    Story = require("./Story.react"),
    ReactCSSTransitionGroup = require("react-addons-css-transition-group");

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
            </div>
            <div className="soft-box">
                <ReactCSSTransitionGroup transitionName="blink" transitionEnterTimeout={2000} transitionLeaveTimeout={1}>
                    {nodes}
                </ReactCSSTransitionGroup>
            </div>
        </div>
    );
};

module.exports = Month;
