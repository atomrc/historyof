/*global require, module*/
(function () {
    "use strict";
    var actions = require("../constants/constants").actions,
        dispatcher = require("../dispatcher/appDispatcher"),
        historyOfApi = require("../api/historyOfApi");

    module.exports = {
        create: function (timeline) {
            dispatcher.dispatch(actions.CREATE_TIMELINE, { timeline: timeline });

            historyOfApi
                .createTimeline(timeline)
                .then(function (data) {
                    dispatcher.dispatch(actions.RECEIVE_CREATED_TIMELINE, { timeline: data });
                });
        },

        get: function (timelineId) {
            historyOfApi
                .getTimeline(timelineId)
                .then(function (timeline) {
                    dispatcher.dispatch(actions.RECEIVE_TIMELINE, { timeline: timeline });
                    dispatcher.dispatch(actions.RECEIVE_EVENTS, { events: timeline.events });
                });
        }
    };
}());
