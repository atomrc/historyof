/*global require*/
(function () {
    "use strict";
    var React = require("react"),
        Timeline = require("./component/timeline"),
        AddButton = require("./component/add-button"),
        EventForm = require("./component/event-form");

    React.render(<Timeline/>, document.getElementById("main"));
    React.render(<EventForm/>, document.getElementById("form"));
    React.render(<AddButton/>, document.getElementById("add"));
}());
