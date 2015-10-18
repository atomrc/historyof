/*global require, module */
(function () {
    "use strict";
    var React = require("react"),
        Event = require("./Event.react");

    var Month = React.createClass({

        render: function () {
            var nodes = this
                .props
                .events
                .map(function (event) {
                    return (
                        <Event event={event} key={event.id}/>
                    );
                }.bind(this));

            var month = this.props.month;
            return (
                <div>
                    <div className="month">
                        {month}
                        <div style={{clear: "both"}}></div>
                    </div>
                    <div className="soft-box">{nodes}</div>
                </div>
            );
        }
    });

    module.exports = Month;
}());
