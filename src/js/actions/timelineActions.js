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

        remove: function (timeline) {
            dispatcher.dispatch(actions.REMOVE_TIMELINE, { timeline: timeline });

            historyOfApi.removeTimeline(timeline);
        },

        get: function (timelineId) {
            dispatcher.dispatch(actions.LOAD_TIMELINE, { tid: timelineId });
            dispatcher.dispatch(actions.LOAD_EVENTS);

            historyOfApi
                .getTimeline(timelineId)
                .then(function (timeline) {
                    dispatcher.dispatch(actions.RECEIVE_TIMELINE, { timeline: timeline });
                    dispatcher.dispatch(actions.RECEIVE_EVENTS, { events: timeline.events });
                });
        }
    };
}());
