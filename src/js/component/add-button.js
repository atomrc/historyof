/*global require*/
(function () {
    "use strict";
    var React = require("react"),
        eventManager = require("../event/manager"),
        eventEvents = require("../event/event-events");

    var AddButton = React.createClass({

        sendAddEvent: function () {
            eventManager.dispatchEvent(eventEvents.request.create, {});
        },

        render: function () {
            return (
                <button id="add-button" className="material" onClick={this.sendAddEvent}>+</button>
            );
        }
    });

    module.exports = AddButton;
}());
