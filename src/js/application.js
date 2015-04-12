/*global require, document*/
(function () {
    "use strict";
    var React = require("react"),
        HistoryOfApp = require("./components/HistoryOfApp.react");

    React.render(<HistoryOfApp/>, document.getElementById("main"));
    var actions = require("./actions/eventActions");

    actions.load();
}());
