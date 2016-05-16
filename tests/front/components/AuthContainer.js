/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import expect from "expect.js";
import {div, mockDOMSource} from '@cycle/dom';
import $ from "vdom-query";
import assign from "object-assign";

import {Observable} from "rx";

function empty(observables) {
    return Observable.merge(...observables).isEmpty();
}

function generateComponentBuilder(overrides) {
    return function buildComponent(ComponentFn, props) {
        var component = ComponentFn(props);
        return assign({}, component, overrides);
    }
}

describe("AuthContainer Component", () => {
    const AuthContainer = require(APP_PATH + "/components/AuthContainer").default;

    it("should display login form if no token given", (done) => {
        const DOMSource = mockDOMSource();
        const storageSource = {
                local: {
                    getItem: () => Observable.just(null)
                }
            },
            buildComponent = generateComponentBuilder({
                DOM: Observable.just(div(".dummy-login-form"))
            });

        const {DOM, api, storage} = AuthContainer({
            DOM: DOMSource,
            api: Observable.empty(),
            storage: storageSource,
            props: { buildComponent }
        });

        DOM.subscribe(vtree => {
            const render = () => vtree;
            const loginForm = $(render);
            expect(loginForm.hasClass("dummy-login-form")).to.be(true);
        });

        empty([storage, api])
            .subscribe(isEmpty => {
                expect(isEmpty).to.be(true);
                done();
            });
    });

    it("should display user container if token is given", (done) => {
        const DOMSource = mockDOMSource(),
            storageSource = {
                local: {
                    getItem: () => Observable.just("usertoken")
                }
            },
            apiSource$ = Observable.empty(),
            buildComponent = generateComponentBuilder({
                DOM: Observable.just({
                    DOM: div(".dummy-user-container")
                })
            });

        const {DOM, storage} = AuthContainer({
            DOM: DOMSource,
            api: apiSource$,
            storage: storageSource,
            props: { buildComponent }
        });

        DOM
            .skip(2)
            .subscribe(vtree => {
                expect(vtree.text).to.be("app");
            });

        empty([storage])
            .subscribe(isEmpty => {
                expect(isEmpty).to.be(true);
                done();
            });
    });

    describe("Invalid token", () => {
        const DOMSource = mockDOMSource(),
            storageSource = {
                local: {
                    getItem: () => Observable.just("expiredtoken")
                }
            },
            buildComponent = generateComponentBuilder({
                DOM: Observable.just({
                    DOM: div(".dummy-user-container")
                }),
                tokenError$: Observable.just({ error: "token is expired" })
            });

        const {DOM, storage} = AuthContainer({
            DOM: DOMSource,
            api: Observable.empty(),
            storage: storageSource,
            props: { buildComponent }
        });

        xit("should display login form with error message", (done) => {
            DOM
                .subscribe(vtree => {
                    done();
                });
        })

        it("should ask for token removal from local storage", (done) => {
            storage
                .subscribe(storageAction => {
                    expect(storageAction).to.eql({
                        action: "removeItem",
                        key: "token"
                    });
                    done();
                });
        });
    });

    describe("Logout", () => {
        const DOMSource = mockDOMSource(),
            storageSource = {
                local: {
                    getItem: () => Observable.just("expiredtoken")
                }
            },
            buildComponent = generateComponentBuilder({
                DOM: Observable.just({
                    DOM: div(".dummy-user-container")
                }),
                logoutAction$: Observable.just(1)
            });

        const {DOM, storage} = AuthContainer({
            DOM: DOMSource,
            api: Observable.empty(),
            storage: storageSource,
            props: { buildComponent }
        });

        xit("should display login form", (done) => {
            DOM
                .subscribe(vtree => {
                    done();
                });
        })

        it("should ask for token removal from local storage", (done) => {
            storage
                .subscribe(storageAction => {
                    expect(storageAction).to.eql({
                        action: "removeItem",
                        key: "token"
                    });
                    done();
                });
        });
    });
});
