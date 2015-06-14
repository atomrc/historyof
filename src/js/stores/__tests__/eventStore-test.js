/*global expect, it, jest, describe, require*/

var APP_PATH = "../..";
jest.dontMock(APP_PATH + "/stores/eventStore");
jest.dontMock("object-assign");

describe("eventStore", function () {
    "use strict";
    var dispatcher = require(APP_PATH + "/dispatcher/appDispatcher"),
        actions = require(APP_PATH + "/constants/constants").actions,
        eventStore = require(APP_PATH + "/stores/eventStore"),
        callback = dispatcher.register.mock.calls[0][0];

    it("should be empty at init", function () {
        expect(eventStore.get()).toBeUndefined();
    });

    it("loads event from the server", function () {
        callback({
            action: actions.RECEIVE_EVENTS,
            data: {
                events: [{
                    id: 1,
                    title: "event",
                    type: "email",
                    date: "2015-04-27T18:45:01.995Z"
                }]
            }
        });

        expect(eventStore.get().length).toBe(1);
        expect(eventStore.get()[0].date.getFullYear()).toBe(2015);
    });

    it("create and update with the server's response", function () {
        var assign = require("object-assign");

        var newEvent = {
                title: "new event",
                type: "event",
                date: new Date(),
                id: 15
            },
            createAction = {
                action: actions.CREATE_EVENT,
                data: { event: newEvent }
            },
            confirmCreateAction = {
                action: actions.RECEIVE_CREATED_EVENT,
                data: { event: newEvent }
            };

        callback(createAction);
        newEvent = eventStore.get()[1];
        expect(eventStore.get().length).toBe(2);
        expect(newEvent.id).toBeDefined();

        callback(confirmCreateAction);
        expect(eventStore.get().length).toBe(2);
        //check that it has an id (corresponding to the id in the DB)
        expect(eventStore.get()[1].id).toBe(15);
    });

    it("create and remove an event", function () {
        var newEvent = {
                id: 12,
                title: "new Event",
                type: "email",
                date: new Date()
            },
            createAction = {
                action: actions.CREATE_EVENT,
                data: { event: newEvent }
            },
            removeAction = {
                action: actions.REMOVE_EVENT,
                data: { event: newEvent }
            };

        callback(createAction);
        expect(eventStore.get().length).toBe(3);

        callback(removeAction);
        expect(eventStore.get().length).toBe(2);
    });

    it("update event", function () {
        var updated = {
                id: 1,
                type: "newtype"
            },
            updateAction = {
                action: actions.UPDATE_EVENT,
                data: {
                    event: updated
                }
            };

        expect(eventStore.get()[0].type).toBe("email");
        callback(updateAction);
        expect(eventStore.get()[0].type).toBe("newtype");

    });
});