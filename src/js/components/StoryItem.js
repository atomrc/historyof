import {Observable} from "rx";
import {li, a} from '@cycle/dom';

function intent(DOM) {
    const removeAction$ = DOM
        .select(".remove")
        .events("click")
        .map(() => ({ type: "remove" }));

    const editAction$ = DOM
        .select(".edit")
        .events("click")
        .map(() => ({ type: "edit" }));

    return {
        editAction$,
        removeAction$
    };
}

function view(story$) {
    return story$.map((story) => li(".story", [
        story.title,
        a(".remove", { href: "#" }, "x"),
        a(".edit", { href: "#" }, "e")
    ]));
}

function StoryItem({DOM, story$}) {
    const { editAction$, removeAction$ } = intent(DOM);
    const vTree$ = view(story$);

    return {
        DOM: vTree$,
        editAction$,
        removeAction$
    };
}

export default StoryItem;
