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
        const sources = {
            DOM: mockDOMSource({}),
            props: {
                story$: xs.empty()
            }
        };

        const { DOM } = StoryForm(sources);

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
        const sources = {

            DOM: mockDOMSource({
                "input": {
                    change: xs.of({
                        target: { name: "title", value: "story one" }
                    })
                },

                ".story-form": { submit: xs.of({ preventDefault: i => i }) }
            }),

            props: {
                story$: xs.empty()
            }
        };

        const { addAction$ } = StoryForm(sources);

        addAction$
            .take(1)
            .addListener(generateListener({
                next: story => {
                    expect(story.title).to.be("story one")
                    done();
                }
            }));
    });

    it("fill form with edited story if given", (done) => {
        const sources = {
            DOM: mockDOMSource({}),

            props: {
                story$: xs.of({ title: "edited story" })
            }
        };

        const { DOM } = StoryForm(sources);

        DOM
            .last()
            .addListener(generateListener({
                next: vtree => {
                    const titleInput = select("input[name=title]", vtree);
                    expect(titleInput[0].data.props.value).to.equal("edited story");
                    done();
                }
            }));
    });
});
