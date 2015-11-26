/*global require, module*/
"use strict";
let actions = require("../constants/constants").actions,
    assign = require("object-assign");

let loginErrorReducer = (state, action) => {
    state = state === undefined ? "" : state;
    switch (action.type) {
        case actions.USER_AUTH_FAILED:
            return "Your session has expired";

        case actions.LOGIN_FAILED:
            return "Login/password don't match";
    }
    return state;
};

let genericErrorReducer = (state, action) => {
    state = state === undefined ? "" : state;
    return state;
};

module.exports = (state, action) => {
    state = state === undefined ? {} : state;
    return {
        login: loginErrorReducer(state.login, action),
        generic: genericErrorReducer(state.generic, action)
    }
};
