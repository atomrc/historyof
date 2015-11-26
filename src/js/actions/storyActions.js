/*global require, module*/
(function () {
    "use strict";
    var actions = require("../constants/constants").actions,
        historyOfApi = require("../api/historyOfApi"),
        uuid = require("uuid");

    module.exports = {

        getAll: (token) => {
            return (dispatch) => {
                historyOfApi
                    .getStories(token)
                    .then(function (stories) {
                        dispatch({
                            type: actions.RECEIVE_STORIES,
                            payload: {
                                stories: stories
                            }
                        });
                    });
            }
        },

        edit: function (story) {
            return {
                type: actions.EDIT_STORY,
                payload: {
                    story: story
                }
            };
        },

        cancelEdit: function () {
            return { type: actions.CANCEL_EDIT_STORY };
        },

        create: function (token, story) {
            return (dispatch) => {
                story.id = uuid.v1();
                dispatch({
                    type: actions.STORY_ADDED,
                    payload: {
                        story: story
                    }
                });
                historyOfApi
                    .createStory(token, story)
                    .then(function (e) {
                        dispatch({
                            type: actions.RECEIVE_CREATED_STORY,
                            payload: {
                                story: e
                            }
                        });
                    });
            };
        },

        update: function (story, token) {
            historyOfApi.updateStory(story, token);
            return {
                type: actions.UPDATE_STORY,
                payload: {
                    story: story
                }
            };
        },

        remove: function (token, story) {
            historyOfApi.remove(token, story);
            return {
                type: actions.REMOVE_STORY,
                payload: {
                    story: story
                }
            };
        }
    };
}());
