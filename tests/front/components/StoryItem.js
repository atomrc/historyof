/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import expect from "expect.js";
import {mockDOMSource} from '@cycle/dom';

import {Observable} from "rx";

describe("StoryItem Component", () => {
    const StoryItem = require(APP_PATH + "/components/StoryItem").default;

    const testStory = { id: "uuid-rand", title: "test story" };


    it("should display given story", () => {
        const story$ = Observable.just(testStory),
            DOM = mockDOMSource();

        const sinks = StoryItem({ DOM, story$ });

        sinks.DOM.subscribe(vtree => {
            expect(vtree.children[0].text).to.be(testStory.title);
        });
    });

    it("should send the remove action when remove button is clicked", () => {
        const story$ = Observable.just(testStory),
            DOM = mockDOMSource({
                ".remove": { click: Observable.just({}) }
            });

        const sinks = StoryItem({ DOM, story$ });

        sinks.action$.subscribe(action => expect(action.type).to.be("remove"));
    });

    it("should send the edit action when edit button is clicked", () => {
        const story$ = Observable.just(testStory),
            DOM = mockDOMSource({
                ".edit": { click: Observable.just({}) }
            });

        const sinks = StoryItem({ DOM, story$ });

        sinks.action$.subscribe(action => expect(action.type).to.be("edit"));
    });
});
