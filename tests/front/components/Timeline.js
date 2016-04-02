/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import expect from "expect.js";
import {mockDOMSource} from '@cycle/dom';

import {Observable} from "rx";

describe("Timeline Component", () => {
    const Timeline = require(APP_PATH + "/components/Timeline").default;

    const initialStories = [
        { id: "first-uuid", title: "first story" },
        { id: "second-uuid", title: "second story" },
        { id: "third-uuid", title: "third story" }
    ];

    it("should display the given stories", () => {
        const stories$ = Observable.just(initialStories),
            DOM = mockDOMSource();

        const sinks = Timeline({ DOM, stories$ });

        sinks.DOM.subscribe(vtree => {
            const header = vtree.children[0].text;
            const storiesList = vtree.children[1];
            expect(header).to.be("3 stories");
            expect(storiesList.children.length).to.be(3);
        });
    });

    it("should send back item actions", () => {
        const stories$ = Observable.just(initialStories),
            DOM = mockDOMSource({
                ".remove": { click: Observable.just({}) }
            });

        const sinks = Timeline({ DOM, stories$ });

        sinks.action$.subscribe(console.log.bind(console));
    });

});
