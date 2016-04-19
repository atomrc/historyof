/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import expect from "expect.js";
import {mockDOMSource} from '@cycle/dom';

import {Observable} from "rx";

describe("App Component", () => {
    const App = require(APP_PATH + "/components/App").default;

    it("should display login form if no token given", (done) => {
        const DOM = mockDOMSource();
        const sinks = App({ DOM, api: Observable.empty(), token: null });

        sinks.DOM.subscribe(vtree => {
            expect(vtree.children[0].text).to.be("unlogged");
        });

        sinks
            .api
            .isEmpty()
            .subscribe(isEmpty => {
                expect(isEmpty).to.be(true);
                done();
            });

    });

    it("should fetch user if token is given", (done) => {
        const DOM = mockDOMSource();
        const sinks = App({ DOM, api: Observable.empty(), token: "usertoken" });

        sinks.DOM.subscribe(vtree => {
            expect(vtree.children[0].text).to.be("login in");
        });

        sinks.api.subscribe(request => {
            expect(request.type).to.be("fetchUser");
            expect(request.token).to.be("usertoken");
            done();
        });
    });

    it("should display user when user is fetched", (done) => {
        const DOM = mockDOMSource(),
            user$ = Observable.just({ pseudo: "felix", login: "felix@felix.fr", password: "password" }),
            apiResponse$ = Observable.just({ action: { type: "fetchUser" }, response: user$ });

        const sinks = App({ DOM, api: apiResponse$, token: "usertoken" });

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

    it("should display user when user is logged in", (done) => {
        const DOM = mockDOMSource(),
            user$ = Observable.just({ pseudo: "felix", login: "felix@felix.fr", password: "password" }),
            apiResponse$ = Observable.just({ action: { type: "fetchUser" }, response: user$ });

        const sinks = App({ DOM, api: apiResponse$, token: "usertoken" });

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

});
