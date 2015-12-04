/*global require, module*/
"use strict";
let actions = require("../constants/constants").actions;

let systemMessagesReducer = (state, action) => {
    state = state === undefined ? [] : state;

    switch (action.type) {
        case actions.LOGIN_FAILED:
            return state.concat({
                id: "login-failed",
                type: "error",
                context: "login",
                message: "Login/Password do not match"
            });

        case actions.USER_AUTH_FAILED:
            return state.concat({
                id: "user-auth-failed",
                type: "error",
                context: "global",
                message: "Your session has expired"
            });
    }
    return state;
};

module.exports = systemMessagesReducer;
