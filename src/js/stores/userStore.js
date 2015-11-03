/*global require, module*/
"use strict";
var actions = require("../constants/constants").actions,
    FluxStore = require("flux/utils").Store;

var instance;

var user;

class UserStore extends FluxStore {
    get() {
        return user;
    }

    __onDispatch(payload) {
        var action = payload.action,
            data = payload.data;

        switch (action) {
            case actions.LOGIN_SUCCESS:
            case actions.RECEIVE_USER:
                user = data.user;
                this.__emitChange();
                break;

            case actions.USER_LOGGED_OUT:
                user = null;
                this.__emitChange();
                break;

            default:
                break;
        }
    }
}

module.exports = function (dispatcher) {
    instance = instance || new UserStore(dispatcher);
    return instance;
};
