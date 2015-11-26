/*global require, module*/
"use strict";
let actions = require("../constants/constants").actions,
    assign = require("object-assign");

let storyReducer = (state, action) => {
    state = state === undefined ? {} : state;
    let payload = action.payload;
    switch (action.type) {
        case actions.EDIT_STORY:
            return payload.story;

        case actions.UPDATE_EDITED_STORY:
            return assign({}, state, payload.updates);

        case actions.CANCEL_EDIT_STORY:
        case actions.UPDATE_STORY:
        case actions.STORY_ADDED:
            return {};
    }
    return state;
};

let activeReducer = (state, action) => {
    state = state === undefined ? false : state;
    switch (action.type) {
        case actions.EDIT_STORY:
            return true;

        case actions.CANCEL_EDIT_STORY:
        case actions.UPDATE_STORY:
        case actions.STORY_ADDED:
            return false;
    }
    return state;
};

module.exports = (state, action) => {
    state = state === undefined ? {} : state;
    return {
        story: storyReducer(state.story, action),
        isActive: activeReducer(state.isActive, action)
    }
};
