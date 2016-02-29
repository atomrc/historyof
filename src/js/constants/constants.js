/*global module*/
"use strict";
module.exports = {
    actions: {
        USER_CREATED: "USER_CREATED", //when user has registered successfully
        LOGIN_SUCCESS: "LOGIN_SUCCESS", //the user has been retreived from the server
        USER_LOGGED_OUT: "USER_LOGGED_OUT", //the user has logged out
        USER_AUTH_FAILED: "USER_AUTH_FAILED", //the user's token is not valid
        LOGIN_FAILED: "LOGIN_FAILED", //the sent user's credentials were not recognize by server
        RECEIVE_USER: "RECEIVE_USER", //the user has been retreived from the server

        STORY_ADDED: "STORY_ADDED",
        STORIES_ADDED: "STORIES_ADDED",
        STORIES_IMPORTATION_PROGRESS: "STORIES_IMPORTATION_PROGRESS",
        REMOVE_STORY: "REMOVE_STORY",
        EDIT_STORY: "EDIT_STORY",
        CANCEL_EDIT_STORY: "CANCEL_EDIT_STORY",
        UPDATE_STORY: "UPDATE_STORY",
        RECEIVE_CREATED_STORY: "RECEIVE_CREATED_STORY",
        RECEIVE_STORIES: "RECEIVE_STORIES",

        UPDATE_EDITED_STORY: "UPDATE_EDITED_STORY",

        SYSTEM_MESSAGE_SEEN: "SYSTEM_MESSAGE_SEEN"
    }
};
