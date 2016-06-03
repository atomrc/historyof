import xs from "xstream";
import {li, a, span} from '@cycle/dom';

function intent(DOM) {
    const removeAction$ = DOM
        .select(".remove")
        .events("click")
        .map(() => ({ type: "remove" }));

    const editAction$ = DOM
        .select(".edit")
        .events("click")
        .map(() => ({ type: "edit" }));

    return xs.merge(removeAction$, editAction$)
}

function view(story$) {
    return story$
        .map((story) => li(".story", [
                span(".title", story.title),
                a(".remove", { href: "#" }, "x"),
                a(".edit", { href: "#" }, "e")
            ])
        );
}

function StoryItem({DOM, props: { story$ }}) {
    return {
        DOM: view(story$),
        action$: intent(DOM)
    };
}

export default StoryItem;
