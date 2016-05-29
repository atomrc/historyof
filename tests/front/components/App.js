/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import xs from "xstream";
import expect from "expect.js";
import select from "snabbdom-selector";
import {mockDOMSource} from '@cycle/dom';

import {generateListener} from "../helpers";

describe("App Component", () => {
    const App = require(APP_PATH + "/components/App").default;

    describe("App init", () => {
        const DOMSource = mockDOMSource({}),
            user$ = xs.of({ pseudo: "felix", login: "felix@felix.fr", password: "password" });

        const {DOM, api}  = App({ DOM: DOMSource, api: xs.empty(), props: { user$ } });

        it("should display user", (done) => {
            DOM
                .last()
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
        const DOM = mockDOMSource({
                ".logout": { click: xs.of({}) }
            }),
            user$ = xs.of({ pseudo: "felix", login: "felix@felix.fr", password: "password" });

        const {logoutAction$} = App({ DOM, api: xs.empty(), props: { user$ } });

        logoutAction$
            .addListener(generateListener({
                next: action => {
                    expect(action.type).to.be("logout")
                    done();
                }
            }));
    });

});
