/*global require*/
(function () {
    "use strict";
    var React = require("react"),
        eventActions = require("../actions/eventActions"),
        eventTypes = require("../config/eventTypes").getTypes();

    var AddButton = React.createClass({

        createType: function (type) {
            var event = {
                type: type,
                date: new Date()
            };
            eventActions.edit(event);
        },

        render: function () {
            var creationButtons = eventTypes.map(function (type) {
                return (
                    <button
                        key={"button-add-" + type.name}
                        className="material"
                        onClick={this.createType.bind(this, type.name)}>
                            <i className={"fa " + type.icon}></i>
                    </button>
                );
            }.bind(this));

            return (
                <div className="add-button-container">
                    <div className="action-buttons">
                        {creationButtons}
                    </div>
                    <button className="material add-button" onClick={this.createType}><i className="fa fa-plus"></i></button>
                </div>
        );
        }
    });

    module.exports = AddButton;
}());
