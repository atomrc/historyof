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
                    <button key={type.name} onClick={this.createType(type.name)}><i className={"fa " + type.icon}></i></button>
                );
            }.bind(this));

            return (
                <div>
                    <EventForm event={this.state.event}/>
                    <div id="add-button-container">
                        <div>
                            {creationButtons}
                        </div>
                        <button id="add-button" className="material" onClick={this.chooseEventType}>+</button>
                    </div>
                </div>
            );
        }
    });

    module.exports = AddButton;
}());
