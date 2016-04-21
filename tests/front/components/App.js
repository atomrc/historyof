/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import expect from "expect.js";
import {mockDOMSource} from '@cycle/dom';

import {Observable} from "rx";

describe("App Component", () => {
    const App = require(APP_PATH + "/components/App").default;

    it("should display user", (done) => {
        const DOM = mockDOMSource(),
            user = { pseudo: "felix", login: "felix@felix.fr", password: "password" };

        const sinks = App({ DOM, api: Observable.empty(), user: user });

        sinks
            .DOM
            .last()
            .subscribe(vtree => {
                expect(vtree.children[0].text).to.be("felix");
            });

        sinks
            .api
            .isEmpty()
            .subscribe(isEmpty => {
                //we should not trigger an api request
                expect(isEmpty).to.be(true);
                done();
            });
    });

    it("should display login form when user logs out", (done) => {
        return done(); //TODO
        const DOM = mockDOMSource({
                ".logout": { click: Observable.just({}) }
            }),

            user$ = Observable.just({ pseudo: "felix", login: "felix@felix.fr", password: "password" }),
            apiResponse$ = Observable.just({ action: { type: "fetchUser" }, response: user$ });

        const sinks = App({ DOM, api: apiResponse$, token: "usertoken" });

        sinks
            .DOM
            .last()
            .subscribe(vtree => {
                expect(vtree.children[0].text).to.be("login in");
            });

        sinks
            .api
            .isEmpty()
            .subscribe(isEmpty => {
                //we should not trigger an api request
                expect(isEmpty).to.be(true);
                done();
            });
    });

});
