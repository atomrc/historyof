/*global require*/
(function () {
    "use strict";
    var React = require("react"),
        EventForm = require("./EventForm.react"),
        eventTypes = require("../config/eventTypes").getTypes();

    var AddButton = React.createClass({

        getInitialState: function () {
            return {
                event: {}
            };
        },

        createType: function (type) {
            return function () {
                this.setState({ event: { type: type, date: new Date() }});
            }.bind(this);
        },

        render: function () {
            var creationButtons = eventTypes.map(function (type) {
                return (
                    <span>
                        <button className="material " key={type.name} onClick={this.createType(type.name)}><i className={"fa " + type.icon}></i></button>
                        <br/>
                    </span>
                );
            }.bind(this));

            return (
                <div id="edit-section">
                    <EventForm event={this.state.event}/>
                    <div id="add-button-container">
                        <div className="action-buttons">
                            {creationButtons}
                        </div>
                        <button id="add-button" className="material"><i className="fa fa-plus"></i></button>
                    </div>
                </div>
            );
        }
    });

    module.exports = AddButton;
}());
