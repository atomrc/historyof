/*global it, describe, require*/
"use strict";
let APP_PATH = __dirname + "/../../../src/js",
    expect = require("expect.js");

describe("storiesReducer", function () {
    "use strict";
    let actions = require(APP_PATH + "/constants/constants").actions,
        storiesReducer = require(APP_PATH + "/reducers/storiesReducer");

    it("loads stories from the server", function () {
        let action = {
            type: actions.RECEIVE_STORIES,
            payload: {
                stories: [{
                    id: 1,
                    title: "story",
                    date: new Date("2015-04-27T18:45:01.995Z")
                }]
            }
        };

        let stories = storiesReducer([], action);
        expect(stories.length).to.be(1);
        expect(stories[0].date.getFullYear()).to.be(2015);
    });

    it("create and update with the server's response", function () {
        let newStory = {
                title: "new Story",
                date: new Date(),
                id: 15
            },
            addAction = {
                type: actions.STORY_ADDED,
                payload: { story: newStory }
            },
            confirmCreateAction = {
                type: actions.RECEIVE_CREATED_STORY,
                payload: { story: newStory }
            };

        let stories = storiesReducer([], addAction);
        expect(stories.length).to.be(1);
        expect(stories[0].id).to.be(15);

        stories = storiesReducer(stories, confirmCreateAction);
        expect(stories.length).to.be(1);
        expect(stories[0].id).to.be(15);
    });

    it("create and remove an story", function () {
        let newStory = {
                id: 12,
                title: "new Story",
                date: new Date()
            },
            addAction = {
                type: actions.STORY_ADDED,
                payload: { story: newStory }
            },
            removeAction = {
                type: actions.REMOVE_STORY,
                payload: { story: newStory }
            };

        let stories = storiesReducer([], addAction);
        expect(stories.length).to.be(1);
        expect(stories[0].id).to.be(12);

        stories = storiesReducer(stories, removeAction);
        expect(stories.length).to.be(0);
    });

    it("update story", function () {
        let oldStory = {
                id: 1,
                title: "old title"
            },
            updatedVersion = {
                id: 1,
                title: "new title"
            },
            updateAction = {
                type: actions.UPDATE_STORY,
                payload: {
                    story: updatedVersion
                }
            };

        let stories = storiesReducer([oldStory], updateAction);
        expect(stories[0].title).to.be("new title");

    });

    it("add multiple stories at once", function () {
        let newStories = [
                {
                    id: 1,
                    title: "old story"
                },
                {
                    id: 1,
                    title: "second story"
                }
            ],
            storiesAddedAction = {
                type: actions.STORIES_ADDED,
                payload: {
                    stories: newStories
                }
            };

        let stories = storiesReducer([], storiesAddedAction);
        expect(stories.length).to.be(2);
        expect(stories[0].title).to.be("old story");
        expect(stories[1].title).to.be("second story");

    });
});
