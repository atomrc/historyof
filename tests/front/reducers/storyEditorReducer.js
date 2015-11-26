/*global it, describe, require*/
"use strict";
var APP_PATH = __dirname + "/../../../src/js",
    expect = require("expect.js");

describe("editedStoryStore", function () {
    "use strict";
    let actions = require(APP_PATH + "/constants/constants").actions,
        storyEditorReducer = require(APP_PATH + "/reducers/storyEditorReducer");

    let editingState = {
        isActive: true,
        story: {
            title: "my first edit",
            date: new Date(),
            text: "Here we go"
        }
    };

    it("edit an new story", function () {
        let action = {
            type: actions.EDIT_STORY,
            payload: {
                story: { title: "new story" }
            }
        };
        var state = storyEditorReducer({}, action);
        expect(state.isActive).to.be(true);
        expect(state.story).to.eql(action.payload.story);
    });

    it("should end editing when user cancels", function () {
        var endEditAction = {
            type: actions.CANCEL_EDIT_STORY
        };

        var state = storyEditorReducer(editingState, endEditAction);
        expect(state.isActive).to.be(false);
        expect(state.story).to.eql({});
    });

    it("should end editing when story is added", function () {
        var addAction = {
            type: actions.STORY_ADDED
        };

        var state = storyEditorReducer(editingState, addAction);
        expect(state.isActive).to.be(false);
        expect(state.story).to.eql({});
    });

    it("should update content of the edited story", function () {
        var updateAction = {
            type: actions.UPDATE_EDITED_STORY,
            payload: {
                updates: {
                    title: "new title"
                }
            }
        }

        let state = storyEditorReducer(editingState, updateAction);
        expect(state.story.title).to.be(updateAction.payload.updates.title);
    });

    it("should end editing when story is updated", function () {
        var updateAction = {
            type: actions.UPDATE_STORY
        }

        let state = storyEditorReducer(editingState, updateAction);
        expect(state.isActive).to.be(false);
        expect(state.story).to.eql({});
    });
});
