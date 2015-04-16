/*global require, module*/
(function () {
    "use strict";
    var appDispatcher = require("../dispatcher/appDispatcher"),
        eventActions = require("../constants/constants").actions;

    var listeners = [],
        editedEvent = {};

    var editedEventStore = {

        getEditedEvent: function () {
            return editedEvent;
        },

        setEditedEvent: function (event) {
            editedEvent = event;
        },

        addChangeListener: function (callback) {
            listeners.push(callback);
            return listeners.length - 1;
        },

        emitChange: function () {
            listeners.forEach(function (listener) {
                listener();
            });
        }
    };

    appDispatcher.register(function (payload) {
        var action = payload.action,
            data = payload.data;

        switch (action) {
            case eventActions.CREATE_EVENT:
                this.setEditedEvent({});
                this.emitChange();
                break;

            case eventActions.EDIT_EVENT:
                this.setEditedEvent(data.event);
                this.emitChange();
                break;

            case eventActions.END_EDIT_EVENT:
                this.setEditedEvent({});
                this.emitChange();
                break;

            case eventActions.UPDATE_EVENT:
                this.setEditedEvent({});
                this.emitChange();
                break;

            default:
                break;
        }
    }.bind(editedEventStore));

    module.exports = editedEventStore;
}());
