/*global require, module*/
(function () {
    "use strict";
    var appDispatcher = require("../dispatcher/appDispatcher"),
        EventEmitter = require("events").EventEmitter,
        eventActions = require("../constants/constants").actions,
        assign = require("object-assign");

    var editedEvent = {};

    var editedEventStore = assign({}, EventEmitter.prototype, {

        getEditedEvent: function () {
            return editedEvent;
        },

        isEditing() { return !!editedEvent.date },

        update(updates) {
            editedEvent = assign({}, editedEvent, updates);
        },

        addChangeListener: function (callback) {
            this.on("CHANGE", callback);
        },

        removeChangeListener: function (callback) {
            this.removeListener("CHANGE", callback);
        },

        emitChange: function () {
            this.emit("CHANGE");
        }
    });

    appDispatcher.register(function (payload) {
        var action = payload.action,
            data = payload.data;

        switch (action) {

            case eventActions.EDIT_EVENT:
                editedEvent = data.event;
                this.emitChange();
                break;

            case eventActions.CREATE_EVENT:
            case eventActions.CANCEL_EDIT_EVENT:
            case eventActions.UPDATE_EVENT:
                editedEvent = {};
                this.emitChange();
                break;

            case eventActions.UPDATE_EDITED_EVENT:
                this.update(data.updates);
                this.emitChange();
                break;

            default:
                break;
        }
    }.bind(editedEventStore));

    module.exports = editedEventStore;
}());
