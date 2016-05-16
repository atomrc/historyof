/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import expect from "expect.js";
import $ from "vdom-query";
import {mockDOMSource} from '@cycle/dom';

import {Observable} from "rx";

describe("LoginForm Component", () => {
    const LoginForm = require(APP_PATH + "/components/LoginForm").default;

    it("should display login form", (done) => {
        const DOMSource = mockDOMSource();

        const { DOM, api } = LoginForm({ DOM: DOMSource, api: Observable.empty() });

        DOM.subscribe(vtree => {
            const render = () => vtree;
            const form = $(render)
            expect(form.attr("id")).to.be("login-form");
        });

        api
            .isEmpty()
            .subscribe(isEmpty => {
                expect(isEmpty).to.be(true);
                done();
            });
    });

    it("should not be submittable if input is not valid", (done) => {
        const DOMSource = mockDOMSource({
            form: {
                    keyup: Observable.just({
                        currentTarget: {
                            checkValidity: () => false
                        }
                    })
                }
            }
        );

        const {DOM} = LoginForm({ DOM: DOMSource, api: Observable.empty() });

        DOM
            .last()
            .subscribe(vtree => {
                const render = () => vtree;
                const submitButton = $(render).find("input[type=submit]");
                expect(submitButton.attr("disabled")).to.be(true);
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

        const {api} = LoginForm({ DOM, api: Observable.empty() });

        api.subscribe(request => {
            expect(request.action).to.be("login");
            done();
        });
    });

    it("should return user and token when logged in", (done) => {
        const DOM = mockDOMSource(),
            loginResponse$ = Observable.just({
                user: {
                    pseudo: "felix", login: "felix@felix.fr", password: "password"
                },
                token: "usertoken"
            }),
            apiResponse$ = Observable.just({ request: { action: "login" }, response$: loginResponse$ });

        const {loginData$} = LoginForm({ DOM, api: apiResponse$ });

        loginData$.subscribe(({user, token}) => {
            expect(user.pseudo).to.be("felix");
            expect(user.login).to.be("felix@felix.fr");
            expect(token).to.be("usertoken");
            done();
        });
    });

    it("should display error if login fails", (done) => {
        const DOM = mockDOMSource(),
            loginResponse$ = Observable.fromPromise(new Promise(function (resolve, reject) {
                reject({ error: "login/password don't match" });
            })),
            apiResponse$ = Observable.just({ request: { action: "login" }, response$: loginResponse$ });

        const sinks = LoginForm({ DOM, api: apiResponse$ });

        sinks
            .DOM
            .last()
            .subscribe(vtree => {
                const render = () => vtree;
                const errorDiv = $(render).find(".error");
                expect(errorDiv.size()).to.be(1);
                done();
            });
    });

});
