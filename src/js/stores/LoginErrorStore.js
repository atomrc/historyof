/*global require, module, window*/
"use strict";
var actions = require("../constants/constants").actions,
    FluxStore = require("flux/utils").Store;

var error;

class LoginErrorStore extends FluxStore {
    get() {
        return error;
    }

    __onDispatch(payload) {
        var action = payload.action,
            data = payload.data;

        switch (action) {
            case actions.LOGIN_SUCCESS:
                error = null;
                this.__emitChange();
                break;

            case actions.LOGIN_FAILED:
                error = data.error;
                this.__emitChange();
                break;

            default:
                break;
        }
    }
}

module.exports = LoginErrorStore;
