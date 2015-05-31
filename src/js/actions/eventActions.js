/*global require, module*/
(function () {
    "use strict";
    var actions = require("../constants/constants").actions,
        dispatcher = require("../dispatcher/appDispatcher"),
        historyOfApi = require("../api/historyOfApi");

    module.exports = {

        load: function () {
            dispatcher.dispatch(actions.LOAD_EVENTS);

            historyOfApi
                .fetchAll()
                .then(function (events) {
                    dispatcher.dispatch(actions.RECEIVE_EVENTS, { events: events });
                });
        },

        edit: function (event) {
            dispatcher.dispatch(actions.EDIT_EVENT, { event: event });
        },

        cancelEdit: function (event) {
            dispatcher.dispatch(actions.END_EDIT_EVENT);
        },

        create: function (tid, event) {
            dispatcher.dispatch(actions.CREATE_EVENT, { event: event });
            historyOfApi
                .createEvent(tid, event)
                .then(function (e) {
                    dispatcher.dispatch(actions.RECEIVE_CREATED_EVENT, { event: e });
                });
        },

        update: function (tid, event) {
            dispatcher.dispatch(actions.UPDATE_EVENT, { event: event });
            historyOfApi.update(tid, event);
        },

        remove: function (event) {
            dispatcher.dispatch(actions.REMOVE_EVENT, { event: event });
            historyOfApi.remove(event);
        }
    };
}());
