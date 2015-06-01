/*global require, module, window*/
(function () {
    "use strict";
    var appDispatcher = require("../dispatcher/appDispatcher"),
        actions = require("../constants/constants").actions,
        EventEmitter = require("events").EventEmitter,
        assign = require("object-assign");

    var timeline;

    var currentTimelineStore = assign({}, EventEmitter.prototype, {

        get: function () {
            return timeline;
        },

        addChangeListener: function (callback) {
            this.on("CHANGE", callback);
        },

        removeChangeListener: function (callback) {
            this.removeListener("CHANGE", callback);
        },

        emitChange: function () {
            window.setTimeout(() => {
                this.emit("CHANGE");
            }, 0);
        }
    });

    appDispatcher.register(function (payload) {
        var action = payload.action,
            data = payload.data;

        switch (action) {
            case actions.RECEIVE_TIMELINE:
                timeline = data.timeline;
                this.emitChange();
                break;

            default:
                break;
        }
    }.bind(currentTimelineStore));

    module.exports = currentTimelineStore;
}());
