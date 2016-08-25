/*global __dirname, it, describe, require*/
"use strict";
const APP_PATH = __dirname + "/../../../src/js";

import expect from "expect.js";

import {generateListener} from "../helpers";
import $ from "snabbdom-selector";
import {div} from "@cycle/dom";
import xs from "xstream";

function getSources(overrides) {
    const sources = {
        api: {
            select: () => ({
                done$: xs.empty(),
                error$: xs.empty()
            })
        },
        props: {
            user$: xs.empty(),
            Child: () => ({ DOM: xs.of(div("#child")), action$: xs.empty() })
        }
    };

    return {
        ...sources,
        ...overrides,
        props: {
            ...sources.props,
            ...overrides.props
        }
    };
}

const initialStories = [
    { title: "first story", id: 0 },
    { title: "second story", id: 1 }
];


describe("StoriesContainer Component", () => {
    const StoriesContainer = require(APP_PATH + "/components/StoriesContainer").default;

    describe("Init", function () {
        it("should not sent any action if user is not defined", (done) => {
            const sources = getSources({});

            const {api} = StoriesContainer(sources);

            api
                .addListener(generateListener({
                    next: () => {
                        expect(false).to.be(true);
                    }
                }));

            setTimeout(done);
        });
    });

    describe("User defined", () => {
        const sources = getSources({
            props: {
                user$: xs.of({ nickname: "felix" })
            }
        });

        const {api, DOM} = StoriesContainer(sources);

        it("should fetch stories", (done) => {
            api
                .addListener(generateListener({
                    next: request => {
                        expect(request.action).to.be("fetchStories");
                        done();
                    }
                }));
        });

        it("should return child's DOM", (done) => {
            DOM
                .addListener(generateListener({
                    next: vtree => {
                        var child = $("#child", vtree)
                        expect(child.length).to.be(1);
                        done();
                    }
                }));
        });
    });

    describe("Stories fetched", () => {
        const sources = getSources({
            api: {
                select: (selector) => {
                    return selector === "fetchStories" ?
                        {
                            done$: xs.of(initialStories)
                        } :
                        {
                            done$: xs.empty()
                        }
                }
            },
            props: {
                Child: (sources) => ({
                    DOM: sources.props.stories$.map(stories => div(".stories-count", stories.length)),
                    action$: xs.empty()
                })
            }
        });

        const {DOM} = StoriesContainer(sources);

        it("should pass on the fetched stories to child", (done) => {
            DOM
                .addListener(generateListener({
                    next: vtree => {
                        var child = $(".stories-count", vtree)
                        expect(child[0].text).to.be(initialStories.length);
                        done();
                    }
                }));
        });
    });

    describe("Remove story action", () => {

        const sources = getSources({
            api: {
                select: (selector) => {
                    return selector === "fetchStories" ?
                        {
                            done$: xs.of(initialStories)
                        } :
                        {
                            done$: xs.empty()
                        }
                }
            },
            props: {
                Child: (sources) => ({
                    DOM: sources.props.stories$.map(stories => div(".stories-count", stories.length)),
                    action$: xs.of({ type: "remove", param: 0 })
                })
            }
        });

        const {DOM, api} = StoriesContainer(sources);

        it("should send new stories array to child", (done) => {
            DOM
                .drop(1)
                .addListener(generateListener({
                    next: vtree => {
                        var child = $(".stories-count", vtree)
                        expect(child[0].text).to.be(initialStories.length - 1);
                        done();
                    }
                }));
        });

        it("should send remove action to the api", (done) => {
            api
                .addListener(generateListener({
                    next: request => {
                        expect(request.action).to.be("removeStory");
                        expect(request.params).to.be(0);
                        done();
                    }
                }));
        });
    });

    describe("Add story action", () => {
        const sources = getSources({
            api: {
                select: (selector) => {
                    return selector === "fetchStories" ?
                        {
                            done$: xs.of(initialStories)
                        } :
                        {
                            done$: xs.empty()
                        }
                }
            },
            props: {
                Child: (sources) => ({
                    DOM: sources.props.stories$.map(stories => div(".stories-count", stories.length)),
                    action$: xs.of({ type: "add", param: { title: "new story", id: 2 }})
                })
            }
        });

        const {DOM, api} = StoriesContainer(sources);

        it("should send new stories array to child", (done) => {
            DOM
                .drop(1)
                .addListener(generateListener({
                    next: vtree => {
                        var child = $(".stories-count", vtree)
                        expect(child[0].text).to.be(initialStories.length + 1);
                        done();
                    }
                }));
        });

        it("should send create action to the api", (done) => {
            api
                .addListener(generateListener({
                    next: request => {
                        expect(request.action).to.be("createStory");
                        expect(request.params.title).to.be("new story");
                        done();
                    }
                }));
        });
    });

    describe("Update story action", () => {
        const sources = getSources({
            api: {
                select: (selector) => {
                    return selector === "fetchStories" ?
                        {
                            done$: xs.of(initialStories)
                        } :
                        {
                            done$: xs.empty()
                        }
                }
            },
            props: {
                Child: (sources) => ({
                    DOM: sources.props.stories$.map(stories => div(".stories-count", stories.length)),
                    action$: xs.of({ type: "update", param: { title: "updated title", id: 1 }})
                })
            }
        });

        const {DOM, api} = StoriesContainer(sources);

        it("should send new stories array to child", (done) => {
            DOM
                .drop(1)
                .addListener(generateListener({
                    next: vtree => {
                        var child = $(".stories-count", vtree)
                        expect(child[0].text).to.be(initialStories.length);
                        done();
                    }
                }));
        });

        it("should send update action to the api", (done) => {
            api
                .addListener(generateListener({
                    next: request => {
                        expect(request.action).to.be("updateStory");
                        expect(request.params.title).to.be("updated title");
                        done();
                    }
                }));
        });
    });
});
