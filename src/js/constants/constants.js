/*global module*/
(function () {
    "use strict";
    module.exports = {
        actions: {
            USER_LOGIN: "USER_LOGIN", //log the user with his credentials
            USER_LOGGED_OUT: "USER_LOGGED_OUT", //the user has logged out
            LOGIN_FAILED: "LOGIN_FAILED", //the sent user's credentials were not recognize by server
            LOGIN_SUCCESS: "LOGIN_SUCCESS", //the user has been retreived from the server
            RECEIVE_USER: "RECEIVE_USER", //the user has been retreived from the server

            LOAD_EVENTS: "LOAD_EVENTS",
            CREATE_EVENT: "CREATE_EVENT",
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
}());
