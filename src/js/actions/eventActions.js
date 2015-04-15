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

        create: function (type, date) {
            dispatcher.dispatch(actions.CREATE_EVENT, { type: type, date: date });
        },

        save: function (event) {
            dispatcher.dispatch(actions.SAVE_EVENT, { event: event });
        },

        update: function (event) {
            dispatcher.dispatch(actions.UPDATE_EVENT, { event: event });
        },

        remove: function (event) {
            dispatcher.dispatch(actions.REMOVE_EVENT, { event: event });
        }
    };
}());
