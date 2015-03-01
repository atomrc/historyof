(function () {
    "use strict";
    var React = require("react"),
        Event = require("./Event.react"),
        moment = require("moment");

    var Month = React.createClass({

        requestEdition: function (event) {
            return this.props.onRequestEdition && this.props.onRequestEdition(event);
        },

        requestCreation: function () {
            var m = moment().month(this.props.month);
            return this.props.onRequestCreation && this.props.onRequestCreation("email", m.toDate());
        },

        render: function () {
            var nodes = this
                .props
                .events
                .map(function (event) {
                    return (
                        <Event event={event} key={event.id || event.frontId} onRequestEdition={this.requestEdition}/>
                    );
                }.bind(this));

            var month = this.props.month;
            return (
                <div>
                    <div className="month">{month} ({this.props.events.length}) <button onClick={this.requestCreation}>+</button></div>
                    <div>{nodes}</div>
                </div>
            );
        }
    });

    module.exports = Month;
}());
