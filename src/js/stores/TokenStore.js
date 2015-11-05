/*global require, module, window*/
"use strict";
var actions = require("../constants/constants").actions,
    FluxStore = require("flux/utils").Store;

var token = window.localStorage.getItem("token") ?
    window.localStorage.getItem("token") :
    null;

class TokenStore extends FluxStore {
    get() {
        return token;
    }

    __onDispatch(payload) {
        var action = payload.action,
            data = payload.data;

        switch (action) {
            case actions.LOGIN_SUCCESS:
                token = data.token;
                window.localStorage.setItem("token", token);
                this.__emitChange();
                break;

            case actions.USER_LOGGED_OUT:
                token = null;
                window.localStorage.clear();
                this.__emitChange();
                break;

            default:
                break;
        }
    }
}

module.exports = TokenStore;
