/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import expect from "expect.js";
import {mockDOMSource} from '@cycle/dom';

import xs from "xstream";

describe("StoryItem Component", () => {
    const StoryItem = require(APP_PATH + "/components/StoryItem").default;

    const testStory = { id: "uuid-rand", title: "test story" };


    it("should display given story", () => {
        const story$ = xs.of(testStory),
            DOM = mockDOMSource({});

        const sinks = StoryItem({ DOM, story$ });

        sinks.DOM.addListener(vtree => {
            expect(vtree.children[0].text).to.be(testStory.title);
        });
    });

    it("should send the remove action when remove button is clicked", (done) => {
        const story$ = xs.of(testStory),
            DOM = mockDOMSource({
                elements: {
                    ".remove": { click: xs.of({}) }
                }
            });

        const { removeAction$ } = StoryItem({ DOM, story$ });

        removeAction$.addListener(() => done());
    });

    it("should send the edit action when edit button is clicked", () => {
        const story$ = xs.of(testStory),
            DOM = mockDOMSource({
                elements: {
                    ".edit": { click: xs.of({}) }
                }
            });

        const { editAction$ } = StoryItem({ DOM, story$ });

        editAction$.addListener(action => expect(action.type).to.be("edit"));
    });
});
