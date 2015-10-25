/*global require, module, window*/
(function () {
    "use strict";
    var appDispatcher = require("../dispatcher/appDispatcher"),
        actions = require("../constants/constants").actions,
        EventEmitter = require("events").EventEmitter,
        assign = require("object-assign");

    var error;

    var loginStore = assign({}, EventEmitter.prototype, {

        getError: function () {
            return error;
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
            case actions.LOGIN_SUCCESS:
                error = null;
                this.emitChange();
                break;

            case actions.LOGIN_FAILED:
                error = data.error;
                this.emitChange();
                break;

            default:
                break;
        }
    }.bind(loginStore));

    module.exports = loginStore;
}());
