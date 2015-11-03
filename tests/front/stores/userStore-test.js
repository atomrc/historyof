/*global it, describe, require*/
"use strict";
var APP_PATH = __dirname + "/../../../src/js",
    expect = require("expect.js");

describe("userStore", function () {
    "use strict";
    var dispatcher = {
            register: (cb) => { callback = cb; },
            isDispatching: () => true
        },
        actions = require(APP_PATH + "/constants/constants").actions,
        userStore = require(APP_PATH + "/stores/userStore")(dispatcher),
        callback;

    it("should load data from the server", function () {
        var user = {
            firstname: "Felix",
            lastname: "Anon"
        };

        callback({ action: actions.RECEIVE_USER, data: { user: user }});
        expect(userStore.get()).to.be(user);
    });

});
