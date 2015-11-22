/*global module*/
"use strict";
module.exports = {
    actions: {
        LOGIN_SUCCESS: "LOGIN_SUCCESS", //the user has been retreived from the server
        USER_LOGGED_OUT: "USER_LOGGED_OUT", //the user has logged out
        USER_AUTH_FAILED: "USER_AUTH_FAILED", //the user's token is not valid
        LOGIN_FAILED: "LOGIN_FAILED", //the sent user's credentials were not recognize by server
        RECEIVE_USER: "RECEIVE_USER", //the user has been retreived from the server

        EVENT_ADDED: "EVENT_ADDED",
        SAVE_EVENT: "SAVE_EVENT",
        REMOVE_EVENT: "REMOVE_EVENT",
        EDIT_EVENT: "EDIT_EVENT",
        CANCEL_EDIT_EVENT: "CANCEL_EDIT_EVENT",
        UPDATE_EVENT: "UPDATE_EVENT",
        RECEIVE_EVENT: "RECEIVE_EVENT",
        RECEIVE_CREATED_EVENT: "RECEIVE_CREATED_EVENT",
        RECEIVE_EVENTS: "RECEIVE_EVENTS",

        UPDATE_EDITED_EVENT: "UPDATE_EDITED_EVENT"
    }
};
