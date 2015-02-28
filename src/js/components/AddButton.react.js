/*global require*/
(function () {
    "use strict";
    var React = require("react"),
        eventTypes = require("../config/eventTypes").getTypes();

    var AddButton = React.createClass({

        createType: function (type) {
            return function () {
                this.props.onRequestCreation && this.props.onRequestCreation(type);
            }.bind(this);
        },

        render: function () {
            var creationButtons = eventTypes.map(function (type) {
                return (
                    <span key={"button-add-" + type.name}>
                        <button className="material " onClick={this.createType(type.name)}><i className={"fa " + type.icon}></i></button>
                        <br/>
                    </span>
                );
            }.bind(this));

            return (
                <div id="add-button-container">
                    <div className="action-buttons">
                        {creationButtons}
                    </div>
                    <button id="add-button" className="material"><i className="fa fa-plus"></i></button>
                </div>
        );
        }
    });

    module.exports = AddButton;
}());
