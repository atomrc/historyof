/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import expect from "expect.js";
import $ from "vdom-query";
import {mockDOMSource} from '@cycle/dom';

import {Observable} from "rx";

describe("App Component", () => {
    const App = require(APP_PATH + "/components/App").default;

    it("should display user", (done) => {
        const DOM = mockDOMSource(),
            user$ = Observable.just({ pseudo: "felix", login: "felix@felix.fr", password: "password" });

        const sinks = App({ DOM, api: Observable.empty(), user$ });

        sinks
            .DOM
            .last()
            .subscribe(vtree => {
                expect(vtree.children[0].text).to.be("felix");
            });

        sinks
            .api
            .isEmpty()
            .subscribe(isEmpty => {
                //we should not trigger an api request
                expect(isEmpty).to.be(true);
                done();
            });
    });

    it("should return logout action when user logs out", (done) => {
        const DOM = mockDOMSource({
                ".logout": { click: Observable.just({}) }
            }),
            user$ = Observable.just({ pseudo: "felix", login: "felix@felix.fr", password: "password" });

        const {logoutAction$} = App({ DOM, api: Observable.empty(), user$ });

        logoutAction$
            .isEmpty()
            .subscribe(isEmpty => {
                expect(isEmpty).to.be(false);
                done();
            });
    });

});
