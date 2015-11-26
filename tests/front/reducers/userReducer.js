/*global it, describe, require*/
"use strict";
var APP_PATH = __dirname + "/../../../src/js",
    expect = require("expect.js");

describe("userReducer", function () {
    "use strict";
    let actions = require(APP_PATH + "/constants/constants").actions,
        userReducer = require(APP_PATH + "/reducers/userReducer");

    it("should load data from the server", function () {
        var user = {
            firstname: "Felix",
            lastname: "Anon"
        };

        var state = userReducer({}, { type: actions.RECEIVE_USER, payload: { user: user }});
        expect(state).to.be(user);
    });

    it("should clear user when user logs out", () => {
        var action = {
                type: actions.USER_LOGGED_OUT
            },
            state = {
                firstname: "Felix",
                lastname: "Anon"
            };

        var newState  = userReducer(state, action);
        expect(newState).to.eql({});
    });

});
