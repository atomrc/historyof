/*global require, module, window*/
(function () {
    "use strict";
    var appDispatcher = require("../dispatcher/appDispatcher"),
        actions = require("../constants/constants").actions,
        EventEmitter = require("events").EventEmitter,
        assign = require("object-assign");

    var token;

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
            //timeout hack to avoid having
            //multiple disptatch at the same time
            //see https://github.com/facebook/flux/issues/138
            window.setTimeout(() => {
                this.emit("CHANGE");
            }, 0);
        }
    });

    appDispatcher.register(function (payload) {
        var action = payload.action,
            data = payload.data;

        switch (action) {
            case actions.RECEIVE_USER_TOKEN:
                token = data.token;
                this.emitChange();
                break;

            case actions.USER_LOGGED_OUT:
                token = null;
                this.emitChange();
                break;

            default:
                break;
        }
    }.bind(tokenStore));

    module.exports = tokenStore;
}());