/*global require*/
(function () {
    "use strict";
    var React = require("react");

    var AddButton = React.createClass({

        sendAddEvent: function () {
            document.dispatchEvent(new CustomEvent("createEvent", {}));
        },

        render: function () {
            return (
                <button id="add-button" className="material" onClick={this.sendAddEvent}>+</button>
            );
        }
    });

    module.exports = AddButton;
}());
