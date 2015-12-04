/*global require, module*/
"use strict";
let actions = require("../constants/constants").actions;

let systemMessagesReducer = (messages, action) => {
    messages = messages === undefined ? [] : messages;
    var payload = action.payload;

    switch (action.type) {
        case actions.LOGIN_FAILED:
            return messages.concat({
                id: "login-failed",
                type: "error",
                context: "login",
                message: "Login/Password do not match"
            });

        case actions.USER_AUTH_FAILED:
            return messages.concat({
                id: "user-auth-failed",
                type: "error",
                context: "global",
                message: "Your session has expired"
            });

        case actions.SYSTEM_MESSAGE_SEEN:
            return messages.filter(message => message.id !== payload.message.id);
    }
    return messages;
};

module.exports = systemMessagesReducer;
