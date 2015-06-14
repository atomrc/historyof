/*global expect, it, jest, describe, require*/

var APP_PATH = "../..";
jest.dontMock(APP_PATH + "/stores/userStore");
jest.dontMock("object-assign");

describe("userStore", function () {
    "use strict";
    var dispatcher = require(APP_PATH + "/dispatcher/appDispatcher"),
        actions = require(APP_PATH + "/constants/constants").actions,
        userStore = require(APP_PATH + "/stores/userStore"),
        callback = dispatcher.register.mock.calls[0][0];

    it("should load data from the server", function () {
        var user = {
                firstname: "Felix",
                lastname: "Anon"
            },
            reveivedUserAction = {
                action: actions.RECEIVE_USER,
                data: { user: user }
            };

        callback(reveivedUserAction);
        expect(userStore.get()).toBe(user);
    });

});