/*global require*/
(function () {
    "use strict";
    var React = require("react"),
        backendManager = require("./managers/backendManager"),
        HistoryOfApp = require("./components/HistoryOfApp.react");

    React.render(<HistoryOfApp/>, document.getElementById("main"));
    backendManager
        .fetchAll()
        .then(function () {
            window.location.hash = window.location.hash;
        });
}());
