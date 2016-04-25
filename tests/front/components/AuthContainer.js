/*global __dirname, xit, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import expect from "expect.js";
import {mockDOMSource} from '@cycle/dom';

import {Observable} from "rx";

function empty(observables) {
    return Observable.merge(...observables).isEmpty();
}

describe("AuthContainer Component", () => {
    const AuthContainer = require(APP_PATH + "/components/AuthContainer").default;

    it("should display login form if no token given", (done) => {
        const DOMSource = mockDOMSource();
        const storageSource = {
            local: {
                getItem: () => Observable.just(null)
            }
        };
        const {DOM, api, storage} = AuthContainer({ DOM: DOMSource, api: Observable.empty(), storage: storageSource });

        DOM.subscribe(vtree => {
            expect(vtree.children[0].tagName).to.be("FORM");
        });

        empty([api, storage])
            .subscribe(isEmpty => {
                expect(isEmpty).to.be(true);
                done();
            });
    });

    it("should fetch user if token is given", (done) => {
        const DOMSource = mockDOMSource();
        const storageSource = {
            local: {
                getItem: () => Observable.just("usertoken")
            }
        };
        const {DOM, api, storage} = AuthContainer({ DOM: DOMSource, api: Observable.empty(), storage: storageSource });

        DOM.subscribe(vtree => {
            expect(vtree.children[0].text).to.be("login in");
        });

        api.subscribe(request => {
            expect(request.type).to.be("fetchUser");
            expect(request.token).to.be("usertoken");
        });

        empty([storage])
            .subscribe(isEmpty => {
                expect(isEmpty).to.be(true);
                done();
            });
    });

    it("should display app when user is fetched", (done) => {
        const DOMSource = mockDOMSource(),
            storageSource = {
                local: {
                    getItem: () => Observable.just("usertoken")
                }
            },
            user$ = Observable.just({ pseudo: "felix", login: "felix@felix.fr" }),
            apiSource$ = Observable.just({ action: { type: "fetchUser" }, response: user$ });

        const {DOM, storage} = AuthContainer({ DOM: DOMSource, api: apiSource$, storage: storageSource });

        DOM
            .skip(2)
            .subscribe(vtree => {
                expect(vtree.properties.id).to.be("app");
            });

        empty([storage])
            .subscribe(isEmpty => {
                expect(isEmpty).to.be(true);
                done();
            });
    });

    it("should display login form with message if token is expired", (done) => {
        const DOMSource = mockDOMSource(),
            storageSource = {
                local: {
                    getItem: () => Observable.just("expiredtoken")
                }
            },
            errorResponse$ = Observable.fromPromise(new Promise(function (resolve, reject) {
                reject({ error: "token expired" });
            })),
            apiSource$ = Observable.just({ action: { type: "fetchUser" }, response: errorResponse$ });

        const {DOM, api, storage} = AuthContainer({ DOM: DOMSource, api: apiSource$, storage: storageSource });

        DOM
            .skip(2)
            .subscribe(vtree => {
                const errorDiv = vtree.children[0];
                expect(errorDiv.properties.className).to.be("error")
                expect(errorDiv.children[0].text).to.be("token expired")
                done();
            });
    });

    xit("should display login form when user logs out", (done) => {
        const DOMSource = mockDOMSource({
                ".logout": { click: Observable.just({}) }
            }),
            storageSource = { local: { getItem: () => Observable.empty() }},
            user$ = Observable.just({ pseudo: "felix", login: "felix@felix.fr" }),
            apiResponse$ = Observable.just({ action: { type: "fetchUser" }, response: user$ });

        const {DOM, api, storage} = AuthContainer({ DOM: DOMSource, api: apiSource$, storage: storageSource });

        DOM
            .subscribe(vtree => {
                expect(vtree.tagName).to.be("FORM");
            });

        empty([api, storage])
            .subscribe(isEmpty => {
                expect(isEmpty).to.be(true);
                done();
            });
    });


});
