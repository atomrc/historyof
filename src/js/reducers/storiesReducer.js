/*global require, module*/
"use strict";
let actions = require("../constants/constants").actions;

module.exports = (state, action) => {
    state = state === undefined ? false : state;
    let payload = action.payload;
    switch (action.type) {
        case actions.RECEIVE_STORIES:
            return payload.stories;

        case actions.STORY_ADDED:
            return state.concat(payload.story);

        case actions.REMOVE_STORY:
            return state.filter((story) => story.id !== payload.story.id);

        case actions.UPDATE_STORY:
            return state.map((story) => story.id !== payload.story.id ? story : payload.story);
    }
    return state;
};
