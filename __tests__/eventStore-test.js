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
                events: [{}]
            }
        });

        expect(eventStore.getAll().length).toBe(1);
    });
});
