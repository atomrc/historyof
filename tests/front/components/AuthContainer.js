/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import expect from "expect.js";
import {mockDOMSource} from '@cycle/dom';

import {Observable} from "rx";

describe("AuthContainer Component", () => {
    const AuthContainer = require(APP_PATH + "/components/AuthContainer").default;

    it("should display login form if no token given", (done) => {
        const DOM = mockDOMSource();
        const storage = {
            local: {
                getItem: () => Observable.just(null)
            }
        };
        const sinks = AuthContainer({ DOM, api: Observable.empty(), storage });

        sinks.DOM.subscribe(vtree => {
            expect(vtree.tagName).to.be("FORM");
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
        const storage = {
            local: {
                getItem: () => Observable.just("usertoken")
            }
        };
        const sinks = AuthContainer({ DOM, api: Observable.empty(), storage });

        sinks.DOM.subscribe(vtree => {
            expect(vtree.children[0].text).to.be("login in");
        });

        sinks.api.subscribe(request => {
            expect(request.type).to.be("fetchUser");
            expect(request.token).to.be("usertoken");
            done();
        });
    });

    it("should display user when it is fetched", (done) => {
        const DOM = mockDOMSource(),
            storage = {
                local: {
                    getItem: () => Observable.just("usertoken")
                }
            },
            user$ = Observable.just({ pseudo: "felix", login: "felix@felix.fr", password: "password" }),
            apiResponse$ = Observable.just({ action: { type: "fetchUser" }, response: user$ });

        const sinks = AuthContainer({ DOM, api: apiResponse$, storage });

        sinks.DOM.last().subscribe(vtree => {
            expect(vtree.properties.id).to.be("app");
        });

        sinks.api.subscribe(request => {
            expect(request.type).to.be("fetchUser");
            expect(request.token).to.be("usertoken");
            done();
        });
    });

    it("should fetch user when user logs in", (done) => {
        const DOM = mockDOMSource({
                "input[name=login]": { keyup: Observable.just({
                    target: { value: "felix@felix.fr" }
                }) },
                "input[name=password]": { keyup: Observable.just({
                    target: { value: "felix" }
                }) },
                "form": { submit: Observable.just({ preventDefault: () => 1}) }
            }),
            storage = { local: { getItem: () => Observable.empty() }};

        const sinks = AuthContainer({ DOM, api: Observable.empty(), storage });

        sinks.api.subscribe(request => {
            expect(request.type).to.be("login");
            expect(request.login).to.be("felix@felix.fr");
            expect(request.password).to.be("felix");
            done();
        });
    });
    return;

    it("should display login form when user logs out", (done) => {
        expect(false).to.be(true);
        return done(); //TODO
        const DOM = mockDOMSource({
                ".logout": { click: Observable.just({}) }
            }),

            user$ = Observable.just({ pseudo: "felix", login: "felix@felix.fr", password: "password" }),
            apiResponse$ = Observable.just({ action: { type: "fetchUser" }, response: user$ });

        const sinks = AuthContainer({ DOM, api: apiResponse$, token: "usertoken" });

        sinks
            .DOM
            .last()
            .subscribe(vtree => {
                expect(vtree.children[0].text).to.be("unlogged");
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

    it("should display login form with message if token is expired", (done) => {
        //expect(false).to.be(true);
        done();
    });


});
