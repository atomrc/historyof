import xs from "xstream";
import {li, a, span} from '@cycle/dom';

function intent(DOM) {
    const removeAction$ = DOM
        .select(".remove")
        .events("click")
        .map(() => ({ type: "remove" }));

    const navigate$ = DOM
        .select("a.edit")
        .events("click")
        .map(ev => {
            ev.preventDefault()
            return ev;
        })
        .map(ev => ev.target.pathname);

    return {
        action$: removeAction$,
        navigate$
    };
}

function view(story$) {
    return story$
        .map((story) => li(".story", [
                span(".title", story.title),
                a(".remove", { props: { href: "#" } }, "x"),
                a(".edit", { props: { href: "/me/story/" + story.id + "/edit" } }, "e")
            ])
        );
}

function StoryItem({DOM, props: { story$ }}) {
    const { action$, navigate$ } = intent(DOM);

    return {
        DOM: view(story$),
        action$: action$,
        router: navigate$
    };
}

export default StoryItem;
