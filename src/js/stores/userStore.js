/*global require, module*/
(function () {
    "use strict";
    var appDispatcher = require("../dispatcher/appDispatcher"),
        actions = require("../constants/constants").actions,
        EventEmitter = require("events").EventEmitter,
        assign = require("object-assign");

    var token = "eyJhbGciOiJIUzI1NiJ9.ZTM0MjZiM2UtMDNlYi0xMWU1LTlhMTctMDAxZDRmZjk4OTJl.NNBZIDYZPwjhzg4odn0atozpHtGd16piVv2SJ9Kk_lo",
        user;

    var userStore = assign({}, EventEmitter.prototype, {

        get: function () {
            return user;
        },

        hasToken: function () {
            return !!token;
        },

        getToken: function () {
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
            case actions.RECEIVE_USER:
                user = data.user;
                this.emitChange();
                break;

            case actions.RECEIVE_USER_TOKEN:
                token = data.token;
                this.emitChange();
                break;

            case actions.USER_LOGGED_OUT:
                token = null;
                user = null;
                this.emitChange();
                break;

            default:
                break;
        }
    }.bind(userStore));

    module.exports = userStore;
}());
