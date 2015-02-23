/*global require*/
(function () {
    "use strict";
    var React = require("react"),
        HistoryOfApp = require("./components/HistoryOfApp.react");

    React.render(<HistoryOfApp/>, document.getElementById("historyof"));
}());
