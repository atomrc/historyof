/*global require, module*/
(function () {
    "use strict";
    var actions = require("../constants/constants").actions,
        historyOfApi = require("../api/historyOfApi"),
        uuid = require("uuid");

    module.exports = {

        getAll: (token) => {
            return (dispatch) => {
                historyOfApi
                    .getEvents(token)
                    .then(function (events) {
                        dispatch({
                            type: actions.RECEIVE_EVENTS,
                            payload: {
                                events: events
                            }
                        });
                    });
            }
        },

        edit: function (event) {
            return {
                type: actions.EDIT_EVENT,
                payload: {
                    event: event
                }
            };
        },

        cancelEdit: function () {
            return { type: actions.CANCEL_EDIT_EVENT };
        },

        create: function (token, event) {
            return (dispatch) => {
                event.id = uuid.v1();
                dispatch({
                    type: actions.EVENT_ADDED,
                    payload: {
                        event: event
                    }
                });
                historyOfApi
                    .createEvent(token, event)
                    .then(function (e) {
                        dispatch({
                            type: actions.RECEIVE_CREATED_EVENT,
                            payload: {
                                event: e
                            }
                        });
                    });
            };
        },

        update: function (event, token) {
            historyOfApi.updateEvent(event, token);
            return {
                type: actions.UPDATE_EVENT,
                payload: {
                    event: event
                }
            };
        },

        remove: function (token, event) {
            historyOfApi.remove(token, event);
            return {
                type: actions.REMOVE_EVENT,
                payload: {
                    event: event
                }
            };
        }
    };
}());
