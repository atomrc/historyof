/*global require, module*/
"use strict";
let actions = require("../constants/constants").actions,
    assign = require("object-assign");

let storyReducer = (state = {}, {type, payload}) => {
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
};

let activeReducer = (state = false, {type}) => {
    switch (type) {
        case actions.EDIT_STORY:
            return true;

        case actions.CANCEL_EDIT_STORY:
        case actions.STORY_ADDED:
            return false;
    }
    return state;
};

module.exports = (state = {}, action) => {
    return {
        story: storyReducer(state.story, action),
        isActive: activeReducer(state.isActive, action)
    }
};
