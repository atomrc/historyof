/*global require*/
(function () {
    "use strict";
    var React = require("react"),
        EventForm = require("./EventForm.react"),
        eventTypes = require("../config/eventTypes").getTypes();

    var AddButton = React.createClass({

        getInitialState: function () {
            return {
                event: {},
                defaultDate: new Date()
            };
        },

        onEventCreated: function (newEvent) {
            this.setState({defaultDate: newEvent.date, event: {}});
        },

        createType: function (type) {
            return function () {
                this.setState({ event: { type: type, date: this.state.defaultDate }});
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
                <div id="edit-section">
                    <EventForm event={this.state.event} onEventCreated={this.onEventCreated}/>
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
