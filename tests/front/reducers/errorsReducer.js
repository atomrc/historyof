/*global it, describe, require*/
"use strict";
var APP_PATH = __dirname + "/../../../src/js",
    expect = require("expect.js");

describe("errorsReducer", function () {
    "use strict";
    let actions = require(APP_PATH + "/constants/constants").actions,
        errorsReducer = require(APP_PATH + "/reducers/errorsReducer");

    it("should display login errors", function () {
        let authFailAction = { type: actions.USER_AUTH_FAILED },
            loginFailedAction = { type: actions.LOGIN_FAILED };

        let errors = errorsReducer({}, authFailAction);
        expect(errors.login).to.contain("session");

        errors = errorsReducer({}, loginFailedAction);
        expect(errors.login).to.contain("password");
    });
});
