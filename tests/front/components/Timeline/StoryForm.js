/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../../src/js";

import xs from "xstream";
import expect from "expect.js";
import select from "snabbdom-selector";
import jsdom from "mocha-jsdom";
import {mockDOMSource} from '@cycle/dom';
import xstreamAdapter from '@cycle/xstream-adapter';

import {generateListener} from "../../helpers";

describe("StoryForm Component", () => {

    jsdom();

    it("should display empty form if no story given", (done) => {
        const StoryForm = require(APP_PATH + "/components/Timeline/StoryForm").default;

        const sources = {
            DOM: mockDOMSource(xstreamAdapter, {}),
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

    it("should return a create action if user submits a new story", (done) => {
        const StoryForm = require(APP_PATH + "/components/Timeline/StoryForm").default;

        const sources = {
            DOM: mockDOMSource(xstreamAdapter, {
                "input": {
                    keyup: xs.of({
                        target: { name: "title", value: "story one" }
                    })
                },

                "#story-form": { submit: xs.of({ preventDefault: i => i }) }
            }),

            props: {
                story$: xs.empty()
            }
        };

        const { action$ } = StoryForm(sources);

        action$
            .take(1)
            .addListener(generateListener({
                next: action => {
                    expect(action.type).to.be("create")
                    expect(action.params.title).to.be("story one")
                    expect(action.params.id).not.to.be(null)
                    done();
                }
            }));
    });

    it("should return an update action if user edits a story", (done) => {
        const StoryForm = require(APP_PATH + "/components/Timeline/StoryForm").default;

        const sources = {
            DOM: mockDOMSource(xstreamAdapter, {
                "input": {
                    keyup: xs.of({
                        target: { name: "title", value: "updated story" }
                    })
                },

                "#story-form": { submit: xs.of({ preventDefault: i => i }) }
            }),

            props: {
                story$: xs.of({ title: "edited story", id: "story-uuid" })
            }
        };

        const { action$ } = StoryForm(sources);

        action$
            .take(1)
            .addListener(generateListener({
                next: action => {
                    expect(action.type).to.be("update")
                    expect(action.params.title).to.be("updated story")
                    expect(action.params.id).to.be("story-uuid")
                    done();
                }
            }));
    });

    it("fill form with edited story if given", (done) => {
        const StoryForm = require(APP_PATH + "/components/Timeline/StoryForm").default;

        const sources = {
            DOM: mockDOMSource(xstreamAdapter, {}),

            props: {
                story$: xs.of({ title: "edited story" })
            }
        };

        const { DOM } = StoryForm(sources);

        DOM
            .take(1)
            .addListener(generateListener({
                next: vtree => {
                    const titleInput = select("input[name=title]", vtree);
                    expect(titleInput[0].data.props.value).to.equal("edited story");
                    done();
                }
            }));
    });
});
