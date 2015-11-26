/*global require, module*/
"use strict";
let actions = require("../constants/constants").actions;

module.exports = (state = "", {type, payload}) => {
    switch (type) {
        case actions.LOGIN_SUCCESS:
            window.localStorage.setItem("token", payload.token);
            return payload.token;

        case actions.USER_AUTH_FAILED:
        case actions.USER_LOGGED_OUT:
            return "";
    }
    return state;
};
