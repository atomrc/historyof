/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import expect from "expect.js";
import select from "snabbdom-selector";
import {mockDOMSource} from '@cycle/dom';

import xs from "xstream";

describe("UserContainer Component", () => {
    const UserContainer = require(APP_PATH + "/components/UserContainer").default;

    describe("UserContainer init", () => {
        const DOMSource = mockDOMSource({})
            //user$ = xs.of({ pseudo: "felix", login: "felix@felix.fr", password: "password" });

        const {DOM, api}  = UserContainer({ DOM: DOMSource, api: xs.empty(), token$: xs.of("usertoken") });

        it("should display loader", (done) => {
            DOM
                .last()
                .addListener(vtree => {
                    const render = () => vtree;
                    expect($(render).find(".loading").text()).to.be("loading...");
                    done();
                });

        });

        it("should fetch user", (done) => {
            api
                .addListener(request => {
                    //we should not trigger an api request
                    expect(request.action).to.be("fetchUser");
                    done();
                });
        });
    });

    it("should display user when fetched", (done) => {
        const DOMSource = mockDOMSource({}),
            user$ = xs.of({ pseudo: "felix", login: "felix@felix.fr", password: "password" }),
            apiSource$ = xs.of({ request: { action: "fetchUser" }, response$: user$ });

        const {DOM}  = UserContainer({ DOM: DOMSource, api: apiSource$, token$: xs.of("usertoken") });

        DOM
            .last()
            .addListener(vtree => {
                const render = () => vtree;
                expect($(render).find(".pseudo").text()).to.be("felix");
                done();
            });

    });

    it("should return logout action when user logs out", (done) => {
        const DOM = mockDOMSource({
            elements: {
                ".logout": { click: xs.of({}) }
            }
        });

        const {logoutAction$} = UserContainer({ DOM, api: xs.empty(), token$: xs.empty() });

        logoutAction$
            .isEmpty()
            .addListener(isEmpty => {
                expect(isEmpty).to.be(false);
                done();
            });
    });

    it("should return token error if token is invalid", (done) => {
        const DOM = mockDOMSource({}),
            fetchUserError$ = xs.fromPromise(new Promise(function (resolve, reject) {
                reject({ error: "token is expired" });
            })),
            apiResponse$ = xs.of({ request: { action: "fetchUser" }, response$: fetchUserError$ });

        const {tokenError$} = UserContainer({ DOM, api: apiResponse$, token$: xs.empty() });

        tokenError$
            .addListener(response => {
                expect(response.error).to.be("token is expired");
                done();
            });
    });


});
