/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import expect from "expect.js";
import {mockDOMSource} from '@cycle/dom';
import select from "snabbdom-selector";

import {generateListener} from "../helpers";
import xs from "xstream";

describe("Timeline Component", () => {
    const Timeline = require(APP_PATH + "/components/Timeline/Timeline").default;
    const TimelineModel = require(APP_PATH + "/components/Timeline/model").default;

    const initialStories = [
        { id: "first-uuid", title: "first story" },
        { id: "second-uuid", title: "second story" },
        { id: "third-uuid", title: "third story" }
    ];

    it("should display the given stories", (done) => {
        const sources = {
            DOM: mockDOMSource({}),
            props: {
                stories$: xs.of(initialStories)
            }
        };

        const {DOM} = Timeline(sources);

        DOM
            .addListener(generateListener({
                next: vtree => {
                    const header = select(".header", vtree)[0];
                    const storiesList = select("ul", vtree)[0];
                    expect(header.text).to.be("3 stories");
                    expect(storiesList.children.length).to.be(3);
                    done();
                }
            }));
    });

    it("should remove items", (done) => {
        const stories$ = xs.of(initialStories),
            removeAction$ = xs.of({ action: "remove", params: { story: { id: "first-uuid"}}});

        const storiesSink$ = TimelineModel(xs.empty(), removeAction$, stories$);

        storiesSink$
            .last()
            .addListener(generateListener({
                next: (stories) => {
                    expect(stories.length).to.be(initialStories.length - 1);
                    expect(stories[0].title).to.be(initialStories[1].title);
                    done();
                }
            }));
    });

    describe("Edition", () => {
        describe("Add action", () => {
            const stories$ = xs.of(initialStories),
                addAction$ = xs.of({ id: "forth-uuid", title: "Forth Story" });

            const storiesSink$ = TimelineModel(addAction$, xs.empty(), stories$);

            it("should add new item", (done) => {
                storiesSink$
                    .last()
                    .addListener(generateListener({
                        next: (stories) => {
                            expect(stories.length).to.be(initialStories.length + 1);
                            expect(stories[stories.length - 1].title).to.be("Forth Story");
                            done();
                        }
                    }));
            });
        });
    });
});
