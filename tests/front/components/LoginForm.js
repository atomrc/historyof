/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import expect from "expect.js";
import select from "snabbdom-selector";
import {mockDOMSource} from '@cycle/dom';

import xs from "xstream";

const emptyListener = {
    next: () => null,
    error: () => null,
    complete: () => null
};

describe("LoginForm Component", () => {
    const LoginForm = require(APP_PATH + "/components/LoginForm").default;

    describe("Init", () => {
        const DOMSource = mockDOMSource({});

        const { DOM, api } = LoginForm({ DOM: DOMSource, api: xs.empty() });

        it("should display login form", (done) => {
            DOM.addListener(Object.assign({}, emptyListener, {
                next: vtree => {
                    const form = select("form", vtree);
                    expect(form.length).to.be(1);
                    done();
                }
            }));
        })

        it("should not sent api request", () => {
            api
                .addListener(Object.assign({}, emptyListener, {
                    next: () => expect(false).to.be(true)
                }));
        });
    });

    it("should not be submittable if input is not valid", (done) => {
        const DOMSource = mockDOMSource({
            form: {
                keyup: xs.of({
                    currentTarget: {
                        checkValidity: () => false
                    }
                })
            }
        });

        const {DOM} = LoginForm({ DOM: DOMSource, api: xs.empty() });

        DOM
            .last()
            .addListener(Object.assign({}, emptyListener, {
                next: vtree => {
                    const input = select("input[type=submit]", vtree);
                    expect(input.length).to.be(1);
                    expect(input[0].data.attrs.disabled).to.be(true);
                    done();
                }
            }));
    });

    it("should send login request when user logs in", (done) => {
        const DOM = mockDOMSource({
                "input[name=login]": { change: xs.of({
                    target: { value: "felix@felix.fr" }
                }) },
                "input[name=password]": { change: xs.of({
                    target: { value: "password" }
                }) },
                "form": { submit: xs.of({ preventDefault: () => 1}) }
            });

        const {api} = LoginForm({ DOM, api: xs.empty() });


        api
            .addListener(Object.assign({}, emptyListener, {
                next: request => {
                    expect(request.action).to.be("login");
                    expect(request.params.login).to.be("felix@felix.fr");
                    expect(request.params.password).to.be("password");
                    done();
                }
            }));
    });

    it("should return user and token when logged in", (done) => {
        const DOM = mockDOMSource({}),
            loginResponse$ = xs.of({
                user: {
                    pseudo: "felix", login: "felix@felix.fr", password: "password"
                },
                token: "usertoken"
            }),
            apiResponse$ = xs.of({ request: { action: "login" }, response$: loginResponse$ });

        const {loginData$} = LoginForm({ DOM, api: apiResponse$ });

        loginData$
            .addListener(Object.assign({}, emptyListener, {
                next: ({user, token}) => {
                    expect(user.pseudo).to.be("felix");
                    expect(user.login).to.be("felix@felix.fr");
                    expect(token).to.be("usertoken");
                    done();
                }
            }));
    });

    it("should display error if login fails", (done) => {
        const DOM = mockDOMSource({}),
            loginResponse$ = xs.fromPromise(new Promise(function (resolve, reject) {
                reject({ error: "login/password don't match" });
            })),
            apiResponse$ = xs.of({ request: { action: "login" }, response$: loginResponse$ });

        const sinks = LoginForm({ DOM, api: apiResponse$ });

        sinks
            .DOM
            .last()
            .addListener(Object.assign({}, emptyListener, {
                next: vtree => {
                    const input = select(".error", vtree);
                    expect(input.length).to.be(1);
                    done();
                }
            }));
    });

});
