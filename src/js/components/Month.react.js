(function () {
    "use strict";
    var React = require("react"),
        Event = require("./Event.react"),
        AddButton = require("./AddButton.react"),
        moment = require("moment");

    var Month = React.createClass({

        requestEdition: function (event) {
            return this.props.onRequestEdition && this.props.onRequestEdition(event);
        },

        requestCreation: function (type) {
            var m = moment().month(this.props.month);
            return this.props.onRequestCreation && this.props.onRequestCreation(type, m.toDate());
        },

        render: function () {
            var nodes = this
                .props
                .events
                .map(function (event) {
                    return (
                        <Event
                            event={event}
                            key={event.id || event.frontId}
                            onRequestEdition={this.requestEdition}/>
                    );
                }.bind(this));

            var month = this.props.month;
            return (
                <div>
                    <div className="month">
                        {month} ({this.props.events.length})
                        <AddButton onRequestCreation={this.requestCreation}/>
                        <div style={{clear: "both"}}></div>
                    </div>
                    <div className="soft-box">{nodes}</div>
                </div>
            );
        }
    });

    module.exports = Month;
}());
