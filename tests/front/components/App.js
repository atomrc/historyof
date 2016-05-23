/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import expect from "expect.js";
import select from "snabbdom-selector";
import {mockDOMSource} from '@cycle/dom';

import xs from "xstream";

describe("App Component", () => {
    const App = require(APP_PATH + "/components/App").default;

    describe("App init", () => {
        const DOMSource = mockDOMSource({}),
            user$ = xs.of({ pseudo: "felix", login: "felix@felix.fr", password: "password" });

        const {DOM, api}  = App({ DOM: DOMSource, api: xs.empty(), user$ });

        it("should display user", (done) => {
            DOM
                .last()
                .addListener(vtree => {
                    const render = () => vtree;
                    expect($(render).find(".pseudo").text()).to.be("felix");
                    done();
                });

        });

        it("should fetch user's stories", (done) => {
            api
                .addListener(request => {
                    //we should not trigger an api request
                    expect(request.action).to.be("fetchStories");
                    done();
                });
        });
    });

    it("should return logout action when user logs out", (done) => {
        const DOM = mockDOMSource({
                elements: {
                    ".logout": { click: xs.of({}) }
                }
            }),
            user$ = xs.of({ pseudo: "felix", login: "felix@felix.fr", password: "password" });

        const {logoutAction$} = App({ DOM, api: xs.empty(), user$ });

        logoutAction$
            .isEmpty()
            .addListener(isEmpty => {
                expect(isEmpty).to.be(false);
                done();
            });
    });

});
