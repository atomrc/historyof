/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import xs from "xstream";
import expect from "expect.js";
import select from "snabbdom-selector";
import {mockDOMSource, div} from '@cycle/dom';
import xstreamAdapter from '@cycle/xstream-adapter';

import {generateListener} from "../helpers";

describe("App Component", () => {
    const App = require(APP_PATH + "/components/App").default,
        user = { nickname: "felix" };

    function genDefaultSources(overrides) {
        const sources = {
            DOM: mockDOMSource(xstreamAdapter, {}),
            api: {
                select: () => {},
                done$: xs.empty(),
                error$: xs.empty(),
                start$: xs.empty()
            },
            props: {
                Child: () => ({ DOM: xs.of(div("child")) }),
                user$: xs.of(user)
            }
        };

        return { ...sources, ...overrides };
    }

    describe("App init", () => {
        const sources = genDefaultSources({});

        const {DOM}  = App(sources);

        it("should display user", (done) => {
            DOM
                .addListener(generateListener({
                    next: vtree => {
                        const pseudoElm = select(".pseudo", vtree)[0];
                        expect(pseudoElm.text).to.be("felix");
                        done();
                    }
                }));

        });
    });

    it("should return logout action when user logs out", (done) => {
        const sources = genDefaultSources({
            DOM: mockDOMSource(xstreamAdapter, {
                ".logout": { click: xs.of({}) }
            })
        });

        const {auth0} = App(sources);

        auth0
            .addListener(generateListener({
                next: action => {
                    expect(action.action).to.be("logout")
                    done();
                }
            }));
    });

});
