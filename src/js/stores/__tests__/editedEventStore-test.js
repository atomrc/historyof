/*global expect, it, jest, describe, require*/

var APP_PATH = "../..";
jest.dontMock(APP_PATH + "/stores/editedEventStore");
jest.dontMock("object-assign");

describe("eeditedEventStore", function () {
    "use strict";
    var dispatcher = require(APP_PATH + "/dispatcher/appDispatcher"),
        actions = require(APP_PATH + "/constants/constants").actions,
        editedEventStore = require(APP_PATH + "/stores/editedEventStore"),
        callback = dispatcher.register.mock.calls[0][0];

    function setEditing() {
        var event = { id: 12, title: "edited event", date: new Date() },
            editAction = {
                action: actions.EDIT_EVENT,
                data: {
                    event: event
                }
            };

        callback(editAction);
        return event;
    }

    it("edit an event", function () {
        var event = setEditing();
        expect(editedEventStore.getEditedEvent()).toBe(event);
    });

    it("should end editing when user cancels", function () {
        var endEditAction = {
            action: actions.CANCEL_EDIT_EVENT
        };

        callback(endEditAction);
        expect(editedEventStore.getEditedEvent()).toEqual({});
    });

    it("should end editing when event is created", function () {
        var event = setEditing();
        expect(editedEventStore.getEditedEvent()).toBe(event);

        var createAction = {
            action: actions.CREATE_EVENT
        };

        callback(createAction);
        expect(editedEventStore.getEditedEvent()).toEqual({});
    });

    it("should give the current state of edition", function () {
        expect(editedEventStore.isEditing()).toBeFalsy();
        setEditing();
        expect(editedEventStore.isEditing()).toBeTruthy();
    });
});
