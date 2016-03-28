"use strict";
import {li, a} from '@cycle/dom';

function intent(DOM) {
    const action$ = DOM
        .select(".remove")
        .events("click")
        .map(() => ({ type: "remove" }));

    return action$;
}

function view(story$) {
    return story$.map((story) => li(".story", [
        story.title,
        a(".remove", { href: "#" }, "x")
    ]));
}

function storyItem({DOM, story$}) {
    const action$ = intent(DOM);
    const vTree$ = view(story$);

    return {
        DOM: vTree$,
        action$
    };
}

export default storyItem;
