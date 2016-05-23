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
            DOM = mockDOMSource({});

        const sinks = StoryItem({ DOM, story$ });

        sinks.DOM.subscribe(vtree => {
            expect(vtree.children[0].text).to.be(testStory.title);
        });
    });

    it("should send the remove action when remove button is clicked", (done) => {
        const story$ = Observable.just(testStory),
            DOM = mockDOMSource({
                elements: {
                    ".remove": { click: Observable.just({}) }
                }
            });

        const { removeAction$ } = StoryItem({ DOM, story$ });

        removeAction$.subscribe(() => done());
    });

    it("should send the edit action when edit button is clicked", () => {
        const story$ = Observable.just(testStory),
            DOM = mockDOMSource({
                elements: {
                    ".edit": { click: Observable.just({}) }
                }
            });

        const { editAction$ } = StoryItem({ DOM, story$ });

        editAction$.subscribe(action => expect(action.type).to.be("edit"));
    });
});
