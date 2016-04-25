/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import expect from "expect.js";
import {mockDOMSource} from '@cycle/dom';

import {Observable} from "rx";

describe("LoginForm Component", () => {
    const LoginForm = require(APP_PATH + "/components/LoginForm").default;

    it("should display login form", (done) => {
        const DOMSource = mockDOMSource();

        const { DOM, api } = LoginForm({ DOM: DOMSource, api: Observable.empty() });

        DOM.subscribe(vtree => {
            expect(vtree.tagName).to.be("FORM");
        });

        api
            .isEmpty()
            .subscribe(isEmpty => {
                expect(isEmpty).to.be(true);
                done();
            });
    });

    it("should send login request when user logs in", (done) => {
        const DOM = mockDOMSource({
                "input[name=login]": { change: Observable.just({
                    target: { value: "felix@felix.fr" }
                }) },
                "input[name=password]": { change: Observable.just({
                    target: { value: "password" }
                }) },
                "form": { submit: Observable.just({ preventDefault: () => 1}) }
            });

        const sinks = LoginForm({ DOM, api: Observable.empty() });

        sinks.api.subscribe(request => {
            expect(request.type).to.be("login");
            done();
        });
    });

    it("should return user and token logged in", (done) => {
        const DOM = mockDOMSource(),
            loginResponse$ = Observable.just({
                user: {
                    pseudo: "felix", login: "felix@felix.fr", password: "password"
                },
                token: "usertoken"
            }),
            apiResponse$ = Observable.just({ action: { type: "login" }, response: loginResponse$ });

        const sinks = LoginForm({ DOM, api: apiResponse$ });

        sinks.user$.subscribe(user => {
            expect(user.pseudo).to.be("felix");
            expect(user.login).to.be("felix@felix.fr");
        });

        sinks.token$.subscribe(token => {
            expect(token).to.be("usertoken");
            done();
        });
    });

    it("should display error if login fails", (done) => {
        const DOM = mockDOMSource(),
            loginResponse$ = Observable.fromPromise(new Promise(function (resolve, reject) {
                reject({ error: "login/password don't match" });
            })),
            apiResponse$ = Observable.just({ action: { type: "login" }, response: loginResponse$ });

        const sinks = LoginForm({ DOM, api: apiResponse$ });

        sinks
            .DOM
            .last()
            .subscribe(vtree => {
                expect(vtree.children[0].properties.className).to.be("error");
                done();
            });
    });

});
