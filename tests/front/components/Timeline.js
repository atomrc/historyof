/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import expect from "expect.js";
import {mockDOMSource} from '@cycle/dom';

import {Observable} from "rx";

describe("Timeline Component", () => {
    const Timeline = require(APP_PATH + "/components/Timeline/Timeline").default;
    const TimelineModel = require(APP_PATH + "/components/Timeline/model").default;

    const initialStories = [
        { id: "first-uuid", title: "first story" },
        { id: "second-uuid", title: "second story" },
        { id: "third-uuid", title: "third story" }
    ];

    it("should display the given stories", () => {
        const stories$ = Observable.just(initialStories),
            DOM = mockDOMSource({});

        const sinks = Timeline({ DOM, stories$ });

        sinks.DOM.subscribe(vtree => {
            const header = vtree.children[0].text;
            const storiesList = vtree.children[1];
            expect(header).to.be("3 stories");
            expect(storiesList.children.length).to.be(3);
        });
    });

    it("should remove items", () => {
        const stories$ = Observable.just(initialStories),
            removeAction$ = Observable.just({ action: "remove", story: { id: "first-uuid"}});

        const storiesSink$ = TimelineModel(Observable.empty(), removeAction$, stories$);

        storiesSink$
            .last()
            .subscribe(function (stories) {
                expect(stories.length).to.be(initialStories.length - 1);
                expect(stories[0].title).to.be(initialStories[1].title);
            });
    });

    describe("Edition", () => {
        describe("Add action", () => {
            const stories$ = Observable.just(initialStories),
                addAction$ = Observable.just({ id: "forth-uuid", title: "Forth Story" });

            const storiesSink$ = TimelineModel(addAction$, Observable.empty(), stories$);

            it("should add new item", () => {
                storiesSink$
                    .last()
                    .subscribe(function (stories) {
                        expect(stories.length).to.be(initialStories.length + 1);
                        expect(stories[stories.length - 1].title).to.be("Forth Story");
                    });
            });
        });
    });
});
