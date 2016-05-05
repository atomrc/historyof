/*global __dirname, xit, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import expect from "expect.js";
//import $ from "vdom-query";
import {mockDOMSource} from '@cycle/dom';

import {Observable} from "rx";

describe("StoryForm Component", () => {
    const StoryForm = require(APP_PATH + "/components/StoryForm").default;

    it("should display empty form if no story given", (done) => {
        const DOMSource = mockDOMSource();

        const { DOM } = StoryForm({ DOM: DOMSource });

        DOM.forEach((vtree) => {
            expect(vtree.tagName).to.be("FORM");
            done();
        });
    });

    it("should return a new story when user submits form", (done) => {

        const DOMSource = mockDOMSource({
            "input": {
                change: Observable.just( {
                    target: { name: "title", value: "story one" }
                })
            },

            ":root": { submit: Observable.just({ preventDefault: i => i }) }
        });

        const { addAction$ } = StoryForm({ DOM: DOMSource });

        addAction$
            .forEach(story => {
                expect(story.title).to.be("story one");
                done();
            });
    });

    xit("fill form with edited story if given", () => {
    });
});
