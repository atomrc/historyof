/*global it, describe, require*/
"use strict";
var APP_PATH = __dirname + "/../../../src/js",
    expect = require("expect.js");

describe("editedEventStore", function () {
    "use strict";
    var dispatcher = {
            register: (cb) => { callback = cb; },
            isDispatching: () => true
        },
        actions = require(APP_PATH + "/constants/constants").actions,
        editedEventStore = require(APP_PATH + "/stores/editedEventStore")(dispatcher),
        callback;

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
        expect(editedEventStore.get()).to.be(event);
    });

    it("should end editing when user cancels", function () {
        var endEditAction = {
            action: actions.CANCEL_EDIT_EVENT
        };

        callback(endEditAction);
        expect(editedEventStore.get()).to.eql({});
    });

    it("should end editing when event is created", function () {
        var event = setEditing();
        expect(editedEventStore.get()).to.be(event);

        var createAction = {
            action: actions.CREATE_EVENT
        };

        callback(createAction);
        expect(editedEventStore.get()).to.eql({});
    });

    it("should give the current state of edition", function () {
        expect(editedEventStore.isEditing()).to.not.be.ok();
        setEditing();
        expect(editedEventStore.isEditing()).to.be.ok();
    });
});
