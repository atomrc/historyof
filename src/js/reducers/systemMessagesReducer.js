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

        case actions.STORIES_IMPORTATION_PROGRESS:
            return messages
                //remove potential doubles
                .filter(message => message.id !== "import-progression")
                .concat({
                    id: "import-progression",
                    type: "info",
                    context: "global",
                    message: "Importing stories " + payload.nbDone + "/" + payload.total
                });

        case actions.RECEIVE_CREATED_STORY:
            return messages
                //remove potential doubles
                .filter(message => message.id !== "story-created")
                .concat({
                    id: "story-created",
                    type: "info",
                    context: "global",
                    message: "The story " + payload.story.title + " has been saved"
                });

        case actions.SYSTEM_MESSAGE_SEEN:
            return messages.filter(message => message.id !== payload.message.id);
    }
    return messages;
};

module.exports = systemMessagesReducer;
