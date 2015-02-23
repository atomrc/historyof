(function () {
    "use strict";
    var React = require("react"),
        Timeline = require("./Timeline.react"),
        PureRenderMixin = require('react/addons').addons.PureRenderMixin,
        //AddButton = require("./AddButton.react"),
        AddButton = require("./AddButton.react");

    /**
     * Will handle and display all the event of the timeline
     * Is also responsible for the global state of the application
     *
     * @return {undefined}
     */
    var HistoryOfApp = React.createClass({

        mixins: [PureRenderMixin],

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
