/*global require, module*/
"use strict";
let actions = require("../constants/constants").actions;

module.exports = (state, action) => {
    state = state ? state : {};
    let payload = action.payload;
    switch(action.type) {
        case actions.LOGIN_SUCCESS:
        case actions.RECEIVE_USER:
            return payload.user;

        case actions.USER_LOGGED_OUT:
            return {};
    }
    return state;
};
