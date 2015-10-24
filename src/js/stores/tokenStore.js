/*global require, module, window*/
(function () {
    "use strict";
    var appDispatcher = require("../dispatcher/appDispatcher"),
        actions = require("../constants/constants").actions,
        EventEmitter = require("events").EventEmitter,
        assign = require("object-assign");

    var token = window.localStorage.getItem("token") ?
        window.localStorage.getItem("token") :
        null;

    var tokenStore = assign({}, EventEmitter.prototype, {

        get: function () {
            return token;
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
                token = data.token;
                window.localStorage.setItem("token", token);
                this.emitChange();
                break;

            case actions.USER_LOGGED_OUT:
                token = null;
                window.localStorage.clear();
                this.emitChange();
                break;

            default:
                break;
        }
    }.bind(tokenStore));

    module.exports = tokenStore;
}());
