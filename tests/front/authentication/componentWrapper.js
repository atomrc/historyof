/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import expect from "expect.js";

import xs from "xstream";

const emptyListener = {
    next: () => null,
    error: () => null,
    complete: () => null
};

describe("Authentication Component wrapper", () => {
    const wrap = require(APP_PATH + "/authentication/componentWrapper").default;

    function getDefaultSources() {
        return {
            storage: { local: { getItem: () => xs.of(null) } },
            router: { history$: xs.of({ hash: "" }) },
            auth0: xs.empty()
        };
    }

    function DummyComponent() {
        return {};
    }

    it("should display Auth0 login form", (done) => {
        const { auth0 } = wrap(DummyComponent)(getDefaultSources());

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

        const Component = wrap(DummyComponent);
        const {auth0} = Component(sources);

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

        const Component = wrap(DummyComponent);
        const {storage} = Component(sources);

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

    it("should display component when user is logged in", (done) => {
        function Component() {
            return {
                DOM: xs.of("component DOM")
            };
        }

        const sources = Object.assign({}, getDefaultSources(), {
            storage: {
                local: {
                    getItem: () => xs.of("b64token")
                }
            }
        });

        const {DOM} = wrap(Component)(sources);

        DOM
            .take(1)
            .addListener(Object.assign({}, emptyListener, {
                next: dom => {
                    expect(dom).to.be("component DOM");
                    done();
                }
            }));
    });

});
