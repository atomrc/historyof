/*global require, module*/
(function () {
    "use strict";
    var actions = require("../constants/constants").actions,
        dispatcher = require("../dispatcher/appDispatcher"),
        historyOfApi = require("../api/historyOfApi"),
        uuid = require("uuid");

    module.exports = {

        getAll: function () {
            historyOfApi
                .getEvents()
                .then(function (events) {
                    dispatcher.dispatch(actions.RECEIVE_EVENTS, { events: events });
                });
        },

        edit: function (event) {
            dispatcher.dispatch(actions.EDIT_EVENT, { event: event });
        },

        cancelEdit: function () {
            dispatcher.dispatch(actions.CANCEL_EDIT_EVENT);
        },

        create: function (event) {
            event.id = uuid.v1();
            dispatcher.dispatch(actions.CREATE_EVENT, { event: event });
            historyOfApi
                .createEvent(event)
                .then(function (e) {
                    dispatcher.dispatch(actions.RECEIVE_CREATED_EVENT, { event: e });
                });
        },

        update: function (event) {
            dispatcher.dispatch(actions.UPDATE_EVENT, { event: event });
            historyOfApi.updateEvent(event);
        },

        remove: function (event) {
            dispatcher.dispatch(actions.REMOVE_EVENT, { event: event });
            historyOfApi.remove(event);
        }
    };
}());
