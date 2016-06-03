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

    describe("init", () => {
        const DOMSource = mockDOMSource({})

        const {DOM, api}  = UserContainer({
            DOM: DOMSource,
            api: xs.empty(),
            props: {
                token$: xs.of("usertoken"),
                buildComponent: generateComponentBuilder({
                    DOM: xs.of(div("#dummy-app", "here I am"))
                })
            }
        });

        it("should display app", (done) => {
            DOM
                .take(1)
                .addListener(generateListener({
                    next: vtree => {
                        const app = select("#dummy-app", vtree);
                        expect(app.length).to.be(1);
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

    it("should display app when user is fetched", (done) => {
        const DOMSource = mockDOMSource({}),
            user$ = xs.never().startWith({ pseudo: "felix", login: "felix@felix.fr" }),
            apiSource$ = xs.of({ request: { action: "fetchUser" }, response$: user$ });

        const {DOM}  = UserContainer({
            DOM: DOMSource,
            api: apiSource$,
            props: {
                token$: xs.of("usertoken"),
                buildComponent: generateComponentBuilder({
                    DOM: xs.of(div(".dummy-app", "app"))
                })
            }
        });

        DOM
            .take(1)
            .addListener(generateListener({
                next: vtree => {
                    const app = select(".dummy-app", vtree);
                    expect(app.length).to.be(1);
                    done();
                }
            }));

    });

    it("should return logout action when user logs out", (done) => {
        const DOM = mockDOMSource({}),
            user$ = xs.never().startWith({ pseudo: "felix", login: "felix@felix.fr" }),
            apiSource$ = xs.of({ request: { action: "fetchUser" }, response$: user$ }),
            buildComponent = generateComponentBuilder({
                action$: xs.of({ type: "logout" })
            });

        const {action$} = UserContainer({
            DOM,
            api: apiSource$,
            props: {
                token$: xs.empty(),
                buildComponent
            }
        });

        action$
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

        const {tokenError$} = UserContainer({
            DOM,
            api: apiResponse$,
            props: {
                token$: xs.empty(),
                buildComponent: generateComponentBuilder()
            }
        });

        tokenError$
            .addListener(generateListener({
                next: response => {
                    expect(response.error).to.be("token is expired");
                    done();
                }
            }));
    });


});
