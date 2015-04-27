/*global require, module*/
(function () {
    "use strict";
    var appDispatcher = require("../dispatcher/appDispatcher"),
        actions = require("../constants/constants").actions,
        EventEmitter = require("events").EventEmitter,
        assign = require("object-assign");

    var token,
        user;

    var userStore = assign({}, EventEmitter.prototype, {

        get: function () {
            return user;
        },

        hasToken: function () {
            return token !== undefined;
        },

        addChangeListener: function (callback) {
            this.on("CHANGE", callback);
        },

        removeChangeListener: function (callback) {
            this.removeListener("CHANGE_EVENT", callback);
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

            default:
                break;
        }
    }.bind(userStore));

    module.exports = userStore;
}());
