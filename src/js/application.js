import {Observable} from 'rx';
import {run} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import isolate from '@cycle/isolate';
import Timeline from "./components/Timeline";
import uuid from "uuid";

function view(timeline$) {
    return timeline$.map(timeline => timeline.DOM);
}

function main({DOM}) {
    const stories = [
        { title: "first", id: uuid.v1() },
        { title: "second", id: uuid.v1() }
    ];

    const timeline$ = Observable.just(isolate(Timeline)({DOM, initialStories$: Observable.just(stories)}));

    return {
        DOM: view(timeline$, DOM)
    };
}

var drivers = {
    DOM: makeDOMDriver("#main")
};

run(main, drivers);
