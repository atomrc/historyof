/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import expect from "expect.js";
import $ from "vdom-query";
import {mockDOMSource} from '@cycle/dom';

import {Observable} from "rx";

describe("UserContainer Component", () => {
    const UserContainer = require(APP_PATH + "/components/UserContainer").default;

    describe("UserContainer init", () => {
        const DOMSource = mockDOMSource({})
            //user$ = Observable.just({ pseudo: "felix", login: "felix@felix.fr", password: "password" });

        const {DOM, api}  = UserContainer({ DOM: DOMSource, api: Observable.empty(), token$: Observable.just("usertoken") });

        it("should display loader", (done) => {
            DOM
                .last()
                .subscribe(vtree => {
                    const render = () => vtree;
                    expect($(render).find(".loading").text()).to.be("loading...");
                    done();
                });

        });

        it("should fetch user", (done) => {
            api
                .subscribe(request => {
                    //we should not trigger an api request
                    expect(request.action).to.be("fetchUser");
                    done();
                });
        });
    });

    it("should display user when fetched", (done) => {
        const DOMSource = mockDOMSource({}),
            user$ = Observable.just({ pseudo: "felix", login: "felix@felix.fr", password: "password" }),
            apiSource$ = Observable.just({ request: { action: "fetchUser" }, response$: user$ });

        const {DOM}  = UserContainer({ DOM: DOMSource, api: apiSource$, token$: Observable.just("usertoken") });

        DOM
            .last()
            .subscribe(vtree => {
                const render = () => vtree;
                expect($(render).find(".pseudo").text()).to.be("felix");
                done();
            });

    });

    it("should return logout action when user logs out", (done) => {
        const DOM = mockDOMSource({
            elements: {
                ".logout": { click: Observable.just({}) }
            }
        });

        const {logoutAction$} = UserContainer({ DOM, api: Observable.empty(), token$: Observable.empty() });

        logoutAction$
            .isEmpty()
            .subscribe(isEmpty => {
                expect(isEmpty).to.be(false);
                done();
            });
    });

    it("should return token error if token is invalid", (done) => {
        const DOM = mockDOMSource({}),
            fetchUserError$ = Observable.fromPromise(new Promise(function (resolve, reject) {
                reject({ error: "token is expired" });
            })),
            apiResponse$ = Observable.just({ request: { action: "fetchUser" }, response$: fetchUserError$ });

        const {tokenError$} = UserContainer({ DOM, api: apiResponse$, token$: Observable.empty() });

        tokenError$
            .subscribe(response => {
                expect(response.error).to.be("token is expired");
                done();
            });
    });


});
