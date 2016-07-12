/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import xs from "xstream";
import jwt from "jsonwebtoken";
import expect from "expect.js";
import select from "snabbdom-selector";
import {mockDOMSource} from '@cycle/dom';
import xstreamAdapter from '@cycle/xstream-adapter';

import {generateListener} from "../helpers";

describe("App Component", () => {
    const App = require(APP_PATH + "/components/App").default,
        token = jwt.sign({ nickname: "felix" }, "secret");

    function genDefaultSources(overrides) {
        const sources = {
            DOM: mockDOMSource(xstreamAdapter, {}),
            api: xs.empty(),
            props: { token$: xs.of(token) }
        };

        return Object.assign({}, sources, overrides);
    }

    describe("App init", () => {
        const sources = genDefaultSources({});

        const {DOM, api}  = App(sources);

        it("should display user", (done) => {
            DOM
                .take(1)
                .addListener(generateListener({
                    next: vtree => {
                        const pseudoElm = select(".pseudo", vtree)[0];
                        expect(pseudoElm.text).to.be("felix");
                        done();
                    }
                }));

        });

        it("should fetch user's stories", (done) => {
            api
                .addListener(generateListener({
                    next: request => {
                        expect(request.action).to.be("fetchStories"),
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

        const {action$} = App(sources);

        action$
            .addListener(generateListener({
                next: action => {
                    expect(action.type).to.be("logout")
                    done();
                }
            }));
    });

});
