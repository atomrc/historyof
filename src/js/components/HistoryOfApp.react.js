(function () {
    "use strict";
    var React = require("react"),
        Timeline = require("./Timeline.react"),
        AddButton = require("./AddButton.react");

    /**
     * Will handle and display all the event of the timeline
     * Is also responsible for the global state of the application
     *
     * @return {undefined}
     */
    var HistoryOfApp = React.createClass({

        render: function () {
            return (
                <div>
                    <Timeline/>
                    <AddButton/>
                </div>
            );
        }

    });

    module.exports = HistoryOfApp;
}())
