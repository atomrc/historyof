/*global require*/
(function () {
    "use strict";
    var React = require("react"),
        eventTypes = require("../config/eventTypes").getTypes();

    var AddButton = React.createClass({

        createType: function (type) {
            this.props.onRequestCreation && this.props.onRequestCreation(type);
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
                    <button className="material add-button"><i className="fa fa-plus"></i></button>
                </div>
        );
        }
    });

    module.exports = AddButton;
}());
