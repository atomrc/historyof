/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import expect from "expect.js";
import $ from "vdom-query";
import {mockDOMSource} from '@cycle/dom';

import {Observable} from "rx";

describe("App Component", () => {
    const App = require(APP_PATH + "/components/App").default;

    describe("App init", () => {
        const DOMSource = mockDOMSource({}),
            user$ = Observable.just({ pseudo: "felix", login: "felix@felix.fr", password: "password" });

        const {DOM, api}  = App({ DOM: DOMSource, api: Observable.empty(), user$ });

        it("should display user", (done) => {
            DOM
                .last()
                .subscribe(vtree => {
                    const render = () => vtree;
                    expect($(render).find(".pseudo").text()).to.be("felix");
                    done();
                });

        });

        it("should fetch user's stories", (done) => {
            api
                .subscribe(request => {
                    //we should not trigger an api request
                    expect(request.action).to.be("fetchStories");
                    done();
                });
        });
    });

    it("should return logout action when user logs out", (done) => {
        const DOM = mockDOMSource({
                elements: {
                    ".logout": { click: Observable.just({}) }
                }
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
