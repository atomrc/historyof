/*global require, module*/
(function () {
    "use strict";
    var actions = require("../constants/constants").actions,
        historyOfApi = require("../api/historyOfApi"),
        jsonFileReader = require("../utils/jsonFileReader"),
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

        /**
         * Import all stories found in a json file
         * will also save them to the server
         *
         * @param {string} token the user's token
         * @param {file} file the file to import
         * @returns {function} dispatch
         */
        importFromFile: function importFromFile(token, file) {
            return dispatch => {
                jsonFileReader
                    .parse(file)
                    .then(stories => {
                        let nbDone = 0;
                        stories = stories.map(story => {
                            story.id = uuid.v1();
                            story.date = new Date(story.date);
                            return story;
                        });

                        function save([story, ...rest]) {
                            if (!story) {
                                dispatch({
                                    type: actions.STORIES_ADDED,
                                    payload: {
                                        stories: stories
                                    }
                                });
                                return;
                            }
                            historyOfApi
                                .createStory(token, story)
                                .then(story => {
                                    dispatch({
                                        type: actions.STORIES_IMPORTATION_PROGRESS,
                                        payload: {
                                            total: stories.length,
                                            nbDone: stories.length - rest.length
                                        }
                                    });
                                });
                                setTimeout(() => save(rest), 500);
                        }

                        save(stories);
                    });
            }
        },

        update: function (token, story) {
            historyOfApi.updateStory(token, story);
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
