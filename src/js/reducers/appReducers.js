/*global require, module*/
var combineReducers = require("redux").combineReducers,
    routerStateReducer = require("redux-router").routerStateReducer,
    actions = require("../constants/constants").actions,
    assign = require("object-assign");

var appReducers = combineReducers( {

    user: (state = {}, {type, payload}) => {
        switch(type) {
            case actions.LOGIN_SUCCESS:
            case actions.RECEIVE_USER:
                return payload.user;

            case actions.USER_LOGGED_OUT:
                return {};
        }
        return state;
    },

    token: function (state = "", {type, payload}) {
        switch (type) {
            case actions.LOGIN_SUCCESS:
                window.localStorage.setItem("token", payload.token);
                return payload.token;

            case actions.USER_AUTH_FAILED:
            case actions.USER_LOGGED_OUT:
                return "";
        }
        return state;
    },

    stories: (state = [], {type, payload}) => {
        switch (type) {
            case actions.RECEIVE_STORIES:
                return payload.stories;

            case actions.STORY_ADDED:
                return state.concat(payload.story);
        }
        return state;
    },

    editedStory: (state = {}, {type, payload}) => {
        switch (type) {
            case actions.EDIT_STORY:
                return payload.story;

            case actions.UPDATE_EDITED_STORY:
                return assign({}, state, payload.updates);

            case actions.CANCEL_EDIT_STORY:
            case actions.STORY_ADDED:
                return {};
        }
        return state;
    },

    isEditing: (state = false, {type}) => {
        switch (type) {
            case actions.EDIT_STORY:
                return true;

            case actions.CANCEL_EDIT_STORY:
            case actions.STORY_ADDED:
                return false;
        }
        return state;
    },

    router: routerStateReducer
});

module.exports = appReducers;
