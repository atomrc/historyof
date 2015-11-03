/*global it, describe, require*/
"use strict";
var APP_PATH = __dirname + "/../../../src/js",
    expect = require("expect.js");

describe("eventStore", function () {
    "use strict";
    var dispatcher = {
            register: (cb) => { callback = cb; },
            isDispatching: () => true
        },
        actions = require(APP_PATH + "/constants/constants").actions,
        eventStore = require(APP_PATH + "/stores/eventStore")(dispatcher),
        callback;

    it("should be empty at init", function () {
        expect(eventStore.get()).to.be(undefined);
    });

    it("loads event from the server", function () {
        callback({
            action: actions.RECEIVE_EVENTS,
            data: {
                events: [{
                    id: 1,
                    title: "event",
                    date: "2015-04-27T18:45:01.995Z"
                }]
        }});

        expect(eventStore.get().length).to.be(1);
        expect(eventStore.get()[0].date.getFullYear()).to.be(2015);
    });

    it("create and update with the server's response", function () {
        var assign = require("object-assign");

        var newEvent = {
                title: "new event",
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
        expect(eventStore.get().length).to.be(2);
        expect(newEvent.id).to.be(15);

        callback(confirmCreateAction);
        expect(eventStore.get().length).to.be(2);
        expect(eventStore.get()[1].id).to.be(15);
    });

    it("create and remove an event", function () {
        var newEvent = {
                id: 12,
                title: "new Event",
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
        expect(eventStore.get().length).to.be(3);

        callback(removeAction);
        expect(eventStore.get().length).to.be(2);
    });

    it("update event", function () {
        var updated = {
                id: 1,
                title: "another title"
            },
            updateAction = {
                action: actions.UPDATE_EVENT,
                data: {
                    event: updated
                }
            };

        expect(eventStore.get()[0].title).to.be("event");
        callback(updateAction);
        expect(eventStore.get()[0].title).to.be("another title");

    });
});
