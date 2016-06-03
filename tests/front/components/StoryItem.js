/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import xs from "xstream";
import expect from "expect.js";
import {mockDOMSource} from '@cycle/dom';
import select from "snabbdom-selector";

import {generateListener} from "../helpers";

describe("StoryItem Component", () => {
    const StoryItem = require(APP_PATH + "/components/StoryItem").default;

    const testStory = { id: "uuid-rand", title: "test story" };

    it("should display given story", (done) => {
        const story$ = xs.of(testStory),
            DOM = mockDOMSource({});

        const sinks = StoryItem({ DOM, props: { story$ } });

        sinks
            .DOM
            .take(1)
            .addListener(generateListener({
                next: vtree => {
                    const titleElem = select(".title", vtree)[0];
                    expect(titleElem.text).to.be(testStory.title);
                    done();
                }
            }));
    });

    it("should send the remove action when remove button is clicked", (done) => {
        const story$ = xs.of(testStory),
            DOM = mockDOMSource({
                ".remove": { click: xs.of(1) }
            });

        const { action$ } = StoryItem({ DOM, props: { story$ }});

        action$
            .take(1)
            .addListener(generateListener({
            next: event => {
                expect(event.type).to.be("remove");
                done();
            }
        }));
    });

    it("should send the edit action when edit button is clicked", (done) => {
        const story$ = xs.of(testStory),
            DOM = mockDOMSource({
                ".edit": { click: xs.of({}) }
            });

        const { action$ } = StoryItem({ DOM, props: { story$ }});

        action$
            .take(1)
            .addListener(generateListener({
            next: event => {
                expect(event.type).to.be("edit");
                done();
            }
        }));
    });
});
