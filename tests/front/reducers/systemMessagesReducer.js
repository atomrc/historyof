/*global it, describe, require*/
"use strict";
var APP_PATH = __dirname + "/../../../src/js",
    expect = require("expect.js");

describe("systemMessagesReducer", function () {
    "use strict";
    let actions = require(APP_PATH + "/constants/constants").actions,
        systemMessagesReducer = require(APP_PATH + "/reducers/systemMessagesReducer");

    it("should display login errors", function () {
        let authFailAction = { type: actions.USER_AUTH_FAILED },
            loginFailedAction = { type: actions.LOGIN_FAILED };

        let messages = systemMessagesReducer([], authFailAction);
        expect(messages.length).to.be(1);
        expect(messages[0].type).to.be("error");
        expect(messages[0].context).to.be("global");
        expect(messages[0].message).to.contain("session");


        messages = systemMessagesReducer(messages, loginFailedAction);
        expect(messages.length).to.be(2);
        expect(messages[1].context).to.be("login");
        expect(messages[1].message).to.contain("do not match");
    });

    it("should remove viewed message", function () {
        let messageSeenAction = {
            type: actions.SYSTEM_MESSAGE_SEEN,
            payload: {
                message: {
                    id: "random-message"
                }
            }
        };

        let messages = systemMessagesReducer([{ id: "random-message" }, { id: "another-message" }], messageSeenAction);
        expect(messages.length).to.be(1);
        expect(messages[0].id).to.not.be("random-message");
    });
});
