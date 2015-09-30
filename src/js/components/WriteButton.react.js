/*global module, require*/
(function () {
    "use strict";
    var React = require("react"),
        editedEventActions = require("../actions/editedEventActions");

    var EventForm = React.createClass({

        startEditing: function () {
            editedEventActions.update({ date: new Date() });
        },

        render: function () {
            return (<button className="flat-button" onClick={this.startEditing}><i className="fa fa-book"></i> I feel like writting :)</button>);
        }
    });

    module.exports = EventForm;
}());
