/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../../src/js";

import xs from "xstream";
import expect from "expect.js";
import {mockDOMSource} from '@cycle/dom';
import xstreamAdapter from '@cycle/xstream-adapter';
import select from "snabbdom-selector";

import {generateListener} from "../../helpers";

describe("Story Component", () => {
    const Story = require(APP_PATH + "/components/Timeline/Story").default;

    const testStory = { id: "uuid-rand", title: "test story", date: new Date() };

    function getSources(overrides) {
        const sources = {
            DOM: mockDOMSource(xstreamAdapter, {}),
            router: { history$: xs.empty(), createHref: url => "edit-url" },
            story$: xs.of(testStory),
            options$: xs.of({ full: false })
        };

        return { ...sources, ...overrides };
    }

    it("should display given story", (done) => {
        const sources = getSources();

        const {DOM} = Story(sources);

        DOM
            .take(1)
            .addListener(generateListener({
                next: vtree => {
                    const titleElem = select("header a strong", vtree)[0];
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

        const { action$ } = Story(sources);

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
                "a": { click: xs.of({ preventDefault: () => {}, ownerTarget: { pathname: "edit-url" } }) }
            })
        });

        const { router } = Story(sources);

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
