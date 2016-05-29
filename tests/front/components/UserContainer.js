/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import xs from "xstream";
import expect from "expect.js";
import select from "snabbdom-selector";
import {mockDOMSource, div} from '@cycle/dom';

import {generateListener, generateComponentBuilder} from "../helpers";

describe("UserContainer Component", () => {
    const UserContainer = require(APP_PATH + "/components/UserContainer").default;

    describe("UserContainer init", () => {
        const DOMSource = mockDOMSource({})

        const {DOM, api}  = UserContainer({ DOM: DOMSource, api: xs.empty(), token$: xs.of("usertoken") });

        it("should display loader", (done) => {
            DOM
                .take(1)
                .addListener(generateListener({
                    next: vtree => {
                        const loader = select(".loading", vtree)[0];
                        expect(loader.text).to.be("loading...");
                        done();
                    }
                }));

        });

        it("should fetch user", (done) => {
            api
                .take(1)
                .addListener(generateListener({
                    next: request => {
                        expect(request.action).to.be("fetchUser"),
                        done();
                    }
                }));
        });
    });

    it("should display user when fetched", (done) => {
        const DOMSource = mockDOMSource({}),
            user$ = xs.of({ pseudo: "felix", login: "felix@felix.fr", password: "password" }),
            apiSource$ = xs.of({ request: { action: "fetchUser" }, response$: user$ });

        const {DOM}  = UserContainer({ DOM: DOMSource, api: apiSource$, token$: xs.of("usertoken") });

        DOM
            .last()
            .addListener(generateListener({
                next: vtree => {
                    const pseudo = select(".pseudo", vtree)[0];
                    expect(pseudo.text).to.be("felix");
                    done();
                }
            }));

    });

    it("should return logout action when user logs out", (done) => {
        const DOM = mockDOMSource({
            ".logout": { click: xs.of({}) }
        });

        const {logoutAction$} = UserContainer({ DOM, api: xs.empty(), token$: xs.empty() });

        logoutAction$
            .addListener(generateListener({
                next: (action) => {
                    expect(action.type).to.be("logout"),
                    done()
                }
            }));
    });

    it("should return token error if token is invalid", (done) => {
        const DOM = mockDOMSource({}),
            fetchUserError$ = xs.fromPromise(new Promise(function (resolve, reject) {
                reject({ error: "token is expired" });
            })),
            apiResponse$ = xs.of({ request: { action: "fetchUser" }, response$: fetchUserError$ });

        const {tokenError$} = UserContainer({ DOM, api: apiResponse$, token$: xs.empty() });

        tokenError$
            .addListener(generateListener({
                next: response => {
                    expect(response.error).to.be("token is expired");
                    done();
                }
            }));
    });


});
