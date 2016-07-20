/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import xs from "xstream";
import expect from "expect.js";
import {mockDOMSource} from '@cycle/dom';
import xstreamAdapter from '@cycle/xstream-adapter';
import select from "snabbdom-selector";

import {generateListener} from "../helpers";

describe("StoryItem Component", () => {
    const StoryItem = require(APP_PATH + "/components/StoryItem").default;

    const testStory = { id: "uuid-rand", title: "test story", date: new Date() };

    function getSources(overrides) {
        const sources = {
            DOM: mockDOMSource(xstreamAdapter, {}),
            router: { history$: xs.empty(), createHref: url => "edit-url" },
            story$: xs.of(testStory)
        };

        return { ...sources, ...overrides };
    }

    it("should display given story", (done) => {
        const sources = getSources();

        const {DOM} = StoryItem(sources);

        DOM
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
        const sources = getSources({
            DOM: mockDOMSource(xstreamAdapter, {
                ".remove": { click: xs.of(1) }
            })
        });

        const { action$ } = StoryItem(sources);

        action$
            .take(1)
            .addListener(generateListener({
            next: event => {
                expect(event.type).to.be("remove");
                done();
            }
        }));
    });

    it("should navigate to the edit url", (done) => {
        const sources = getSources({
            DOM: mockDOMSource(xstreamAdapter, {
                "a.edit": { click: xs.of({ preventDefault: () => {}, ownerTarget: { pathname: "edit-url" } }) }
            })
        });

        const { router } = StoryItem(sources);

        router
            .take(1)
            .addListener(generateListener({
                next: url => {
                    expect(url).to.be("edit-url");
                    done();
                }
            }));
    });
});
