/*global expect, it, jest, describe, require*/

var APP_PATH = "../src/js";
jest.dontMock(APP_PATH + "/stores/editedEventStore");
jest.dontMock("object-assign");

describe("eeditedEventStore", function () {
    "use strict";
    var dispatcher = require(APP_PATH + "/dispatcher/appDispatcher"),
        actions = require(APP_PATH + "/constants/constants").actions,
        editedEventStore = require(APP_PATH + "/stores/editedEventStore"),
        callback = dispatcher.register.mock.calls[0][0];


    it("edit an event", function () {
        var editAction = {
            action: actions.EDIT_EVENT,
            data: {
                event: { id: 12, title: "edited event", date: new Date() }
            }
        };

        callback(editAction);
        expect(editedEventStore.getEditedEvent()).toBe(editAction.data.event);
    });

    it("should end editing when user cancels", function () {
        var endEditAction = {
            action: actions.END_EDIT_EVENT
        };

        callback(endEditAction);
        expect(editedEventStore.getEditedEvent()).toEqual({});
    });

    it("should end editing when event is created", function () {
        var editAction = {
            action: actions.EDIT_EVENT,
            data: {
                event: { id: 12, title: "edited event", date: new Date() }
            }
        };

        callback(editAction);
        expect(editedEventStore.getEditedEvent()).toBe(editAction.data.event);

        var createAction = {
            action: actions.CREATE_EVENT
        };

        callback(createAction);
        expect(editedEventStore.getEditedEvent()).toEqual({});
    });
});
