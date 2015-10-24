/*global require, module, window*/
(function () {
    "use strict";
    var appDispatcher = require("../dispatcher/appDispatcher"),
        actions = require("../constants/constants").actions,
        EventEmitter = require("events").EventEmitter,
        assign = require("object-assign");

    var user;

    var userStore = assign({}, EventEmitter.prototype, {

        get: function () {
            return user;
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
            case actions.RECEIVE_USER:
                user = data.user;
                this.emitChange();
                break;

            case actions.USER_LOGGED_OUT:
                user = null;
                this.emitChange();
                break;

            default:
                break;
        }
    }.bind(userStore));

    module.exports = userStore;
}());
