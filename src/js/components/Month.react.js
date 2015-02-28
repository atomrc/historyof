(function () {
    "use strict";
    var React = require("react"),
        Event = require("./Event.react");

    var Month = React.createClass({
        addEvent: function () {
            console.log("ok");
        },

        render: function () {
            var nodes = this
                .props
                .events
                .map(function (event) {
                    return (
                        <Event event={event} key={event.id || event.frontId}/>
                    );
                });

            var month = this.props.month;
            return (
                <div>
                    <div className="month">{month} ({this.props.events.length}) <button onClick={this.addEvent}>+</button></div>
                    <div>{nodes}</div>
                </div>
            );
        }
    });

    module.exports = Month;
}());
