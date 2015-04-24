var APP_PATH = "../src/js";
jest.dontMock(APP_PATH + "/stores/eventStore");
jest.dontMock("object-assign");

describe("eventStore", function () {
    var dispatcher = require(APP_PATH + "/dispatcher/appDispatcher"),
        actions = require(APP_PATH + "/constants/constants").actions,
        eventStore = require(APP_PATH + "/stores/eventStore"),
        callback = dispatcher.register.mock.calls[0][0];

    it("should be empty at init", function () {
        expect(eventStore.getAll().length).toBe(0);
    });

    it("loads event from the server", function () {
        callback({
            action: actions.RECEIVE_EVENTS,
            data: {
                events: [{
                    id: 1,
                    type: "email",
                    date: new Date()
                }]
            }
        });

        expect(eventStore.getAll().length).toBe(1);
    });

    it("create and remove an event", function () {
        var newEvent = {
                id: 12,
                type: "email",
                date: new Date
            },
            createAction = {
                action: actions.CREATE_EVENT,
                data: { event: newEvent }
            },
            removeAction = {
                action: actions.REMOVE_EVENT,
                data: {
                    event: newEvent
                }
            };

        callback(createAction);
        expect(eventStore.getAll().length).toBe(2);

        callback(removeAction);
        expect(eventStore.getAll().length).toBe(1);
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

        console.log(eventStore.getAll());
        expect(eventStore.getAll()[0].type).toBe("email");
        callback(updateAction);
        expect(eventStore.getAll()[0].type).toBe("newtype");

    });
});
