/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import expect from "expect.js";
import {div, mockDOMSource} from '@cycle/dom';
import select from "snabbdom-selector";
import assign from "object-assign";

import xs from "xstream";

const emptyListener = {
    next: () => null,
    error: () => null,
    complete: () => null
};


function generateComponentBuilder(overrides) {
    return function buildComponent(ComponentFn, props) {
        var component = ComponentFn(props);
        return assign({}, component, overrides);
    }
}

describe("AuthContainer Component", () => {
    const AuthContainer = require(APP_PATH + "/components/AuthContainer").default;

    it("should display login form if no token given", (done) => {
        const DOMSource = mockDOMSource({});
        const storageSource = {
                local: {
                    getItem: () => xs.of(null)
                }
            },
            buildComponent = generateComponentBuilder({
                DOM: xs.of(div(".dummy-login-form"))
            });

        const {DOM} = AuthContainer({
            DOM: DOMSource,
            api: xs.empty(),
            storage: storageSource,
            props: { buildComponent }
        });

        DOM
            .take(1)
            .addListener(Object.assign({}, emptyListener, {
                next: vtree => {
                    const loginForm = select(".dummy-login-form", vtree);
                    expect(loginForm.length).to.be(1);
                },
                complete: done
            }));
    });

    it("should display user container if token is given", (done) => {
        const DOMSource = mockDOMSource({}),
            storageSource = {
                local: {
                    getItem: () => xs.of("usertoken")
                }
            },
            apiSource$ = xs.empty(),
            buildComponent = generateComponentBuilder({
                DOM: xs.of(div(".dummy-user-container"))
            });

        const {DOM} = AuthContainer({
            DOM: DOMSource,
            api: apiSource$,
            storage: storageSource,
            props: { buildComponent }
        });

        DOM
            .addListener(Object.assign({}, emptyListener, {
                next: vtree => {
                    console.log(vtree);
                    //expect(select(".dummy-user-container", vtree).length).to.be(1)
                    //done();
                },
                complete: done
            }));
    });

    describe("Invalid token", () => {
        const DOMSource = mockDOMSource({}),
            storageSource = {
                local: {
                    getItem: () => xs.of("expiredtoken")
                }
            },
            buildComponent = generateComponentBuilder({
                DOM: div(".dummy-user-container"),
                tokenError$: xs.of({ error: "token is expired" })
            });

        const {storage, error$} = AuthContainer({
            DOM: DOMSource,
            api: xs.empty(),
            storage: storageSource,
            props: { buildComponent }
        });

        it("should pass on userContainer's error", (done) => {
            error$
                .addListener(Object.assign({}, emptyListener, {
                    next: error => {
                        expect(error.error).to.be("token is expired")
                        done();
                    }
                }));
        })

        xit("should ask for token removal from local storage", (done) => {
            storage
                .addListener(storageAction => {
                    expect(storageAction).to.eql({
                        action: "removeItem",
                        key: "token"
                    });
                    done();
                });
        });
    });

    describe("Logout", () => {
        const DOMSource = mockDOMSource({}),
            storageSource = {
                local: {
                    getItem: () => xs.of("expiredtoken")
                }
            },
            buildComponent = generateComponentBuilder({
                DOM: xs.of({
                    DOM: div(".dummy-user-container")
                }),
                logoutAction$: xs.of(1)
            });

        const {DOM, storage} = AuthContainer({
            DOM: DOMSource,
            api: xs.empty(),
            storage: storageSource,
            props: { buildComponent }
        });

        xit("should display login form", (done) => {
            DOM
                .addListener(vtree => {
                    done();
                });
        })

        xit("should ask for token removal from local storage", (done) => {
            storage
                .addListener(storageAction => {
                    expect(storageAction).to.eql({
                        action: "removeItem",
                        key: "token"
                    });
                    done();
                });
        });
    });
});
