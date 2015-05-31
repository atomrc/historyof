/*global require, module*/
(function () {
    "use strict";
    var appDispatcher = require("../dispatcher/appDispatcher"),
        EventEmitter = require("events").EventEmitter,
        eventActions = require("../constants/constants").actions,
        assign = require("object-assign");

    var listeners = [],
        editedEvent;

    var editedEventStore  = assign({}, EventEmitter.prototype, {

        getEditedEvent: function () {
            return editedEvent;
        },

        isEditing: function () {
            return editedEvent !== undefined;
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
            case eventActions.CREATE_EVENT:
                editedEvent = undefined;
                this.emitChange();
                break;

            case eventActions.EDIT_EVENT:
                editedEvent = data.event;
                this.emitChange();
                break;

            case eventActions.END_EDIT_EVENT:
                editedEvent = undefined;
                this.emitChange();
                break;

            case eventActions.UPDATE_EVENT:
                editedEvent = undefined;
                this.emitChange();
                break;

            default:
                break;
        }
    }.bind(editedEventStore));

    module.exports = editedEventStore;
}());
