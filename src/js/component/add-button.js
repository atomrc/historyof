/*global require*/
(function () {
    "use strict";
    var React = require("react"),
        eventManager = require("../event/manager"),
        eventEvents = require("../event/event-events"),
        eventTypes = require("../config/event-types").getTypes();

    var AddButton = React.createClass({

        createType: function (type) {
            return function () {
                this.sendAddEvent({ type: type });
            }.bind(this);
        },

        sendAddEvent: function (data) {
            eventManager.dispatchEvent(eventEvents.request.create, data);
        },

        render: function () {
            var creationButtons = eventTypes.map(function (type) {
                return (
                    <button key={type.name} onClick={this.createType(type.name)}><i className={"fa " + type.icon}></i></button>
                );
            }.bind(this));
            return (
                <div id="add-button-container">
                    <div>
                        {creationButtons}
                    </div>
                    <button id="add-button" className="material" onClick={this.chooseEventType}>+</button>
                </div>
            );
        }
    });

    module.exports = AddButton;
}());
