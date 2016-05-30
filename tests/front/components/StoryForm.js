/*global __dirname, xit, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import xs from "xstream";
import expect from "expect.js";
import select from "snabbdom-selector";
import {mockDOMSource} from '@cycle/dom';

import {generateListener} from "../helpers";

describe("StoryForm Component", () => {
    const StoryForm = require(APP_PATH + "/components/StoryForm").default;

    it("should display empty form if no story given", (done) => {
        const DOMSource = mockDOMSource({});

        const { DOM } = StoryForm({ DOM: DOMSource });

        DOM
            .take(1)
            .addListener(generateListener({
                next: (vtree) => {
                    const form = select("form", vtree);
                    expect(form.length).to.be(1)
                    done()
                }
            }));
    });

    it("should return a new story when user submits form", (done) => {

        const DOMSource = mockDOMSource({
            "input": {
                change: xs.of({
                    target: { name: "title", value: "story one" }
                })
            },

            ".story-form": { submit: xs.of({ preventDefault: i => i }) }
        });

        const { addAction$ } = StoryForm({ DOM: DOMSource });

        addAction$
            .take(1)
            .addListener(generateListener({
                next: story => {
                    expect(story.title).to.be("story one")
                    done();
                }
            }));
    });

    xit("fill form with edited story if given", () => {
    });
});
