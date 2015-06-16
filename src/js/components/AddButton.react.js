/*global require*/
(function () {
    "use strict";
    var React = require("react"),
        eventActions = require("../actions/eventActions");

    module.exports = React.createClass({

        create: function () {
            var event = {
                date: new Date()
            };
            eventActions.edit(event);
        },

        render: function () {
            return (
                <div className="add-button-container">
                    <button className="material add-button" onClick={this.create}><i className="fa fa-plus"></i></button>
                </div>
        );
        }
    });
}());
