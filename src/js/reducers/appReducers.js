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

    events: (state = [], {type, payload}) => {
        switch (type) {
            case actions.RECEIVE_EVENTS:
                return payload.events;

            case actions.EVENT_ADDED:
                return state.concat(payload.event);
        }
        return state;
    },

    editedEvent: (state = {}, {type, payload}) => {
        switch (type) {
            case actions.EDIT_EVENT:
                return payload.event;

            case actions.UPDATE_EDITED_EVENT:
                return assign({}, state, payload.updates);

            case actions.CANCEL_EDIT_EVENT:
            case actions.EVENT_ADDED:
                return {};
        }
        return state;
    },

    isEditing: (state = false, {type}) => {
        switch (type) {
            case actions.EDIT_EVENT:
                return true;

            case actions.CANCEL_EDIT_EVENT:
            case actions.EVENT_ADDED:
                return false;
        }
        return state;
    },

    router: routerStateReducer
});

module.exports = appReducers;
