/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import expect from "expect.js";
import select from "snabbdom-selector";
import {mockDOMSource} from '@cycle/dom';
import xstreamAdapter from '@cycle/xstream-adapter';

import xs from "xstream";

const emptyListener = {
    next: () => null,
    error: () => null,
    complete: () => null
};

describe("LoginForm Component", () => {
    const LoginForm = require(APP_PATH + "/components/LoginForm").default;

    function getDefaultSources() {
        return {
            DOM: mockDOMSource(xstreamAdapter, {}),
            storage: { local: { getItem: () => xs.of(null) } },
            router: { history$: xs.of({ hash: "empty" }) },
            auth0: xs.empty()
        };
    }


    it("should display Auth0 login form", (done) => {
        const { auth0 } = LoginForm(getDefaultSources());

        auth0.addListener(Object.assign({}, emptyListener, {
            next: action => {
                expect(action.action).to.be("show");
                done();
            }
        }));
    });

    it("should parse token when user is logged in", (done) => {
        const sources = Object.assign({}, getDefaultSources(), {
            router: { history$: xs.of({ hash: "#id_token=b64token" }) }
        });

        const {auth0} = LoginForm(sources);

        auth0
            .take(1)
            .addListener(Object.assign({}, emptyListener, {
                next: action => {
                    expect(action.action).to.be("parseHash");
                    done();
                }
            }));
    });

    it("should save token in local storage once parsed", (done) => {
        const sources = Object.assign({}, getDefaultSources(), {
            auth0: xs.of({
                action: { action: "parseHash" },
                response$: xs.of("b64token")
            })
        });

        const {storage} = LoginForm(sources);

        storage
            .take(1)
            .addListener(Object.assign({}, emptyListener, {
                next: store => {
                    expect(store.key).to.be("token");
                    expect(store.value).to.be("b64token");
                    done();
                }
            }));
    });

    it("should redirect to app when token is stored", (done) => {
        const sources = Object.assign({}, getDefaultSources(), {
            storage: {
                local: {
                    getItem: () => xs.of("b64token")
                }
            }
        });

        const {router} = LoginForm(sources);

        router
            .take(1)
            .addListener(Object.assign({}, emptyListener, {
                next: path => {
                    expect(path).to.be("/me");
                    done();
                }
            }));
    });

});
