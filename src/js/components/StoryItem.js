import xs from "xstream";
import {li, a, span} from '@cycle/dom';

function intent(DOM) {
    const removeAction$ = DOM
        .select(".remove")
        .events("click")
        .map((ev) => ({ type: "remove" }));

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
                span(" "),
                a(".remove", { props: { href: "javascript:void(0)", "storyid": story.id } }, "x"),
                a(".edit", { props: { href: "/me/story/" + story.id + "/edit" } }, "e")
            ])
        );
}

function StoryItem({DOM, story$}) {
    const { action$, navigate$ } = intent(DOM);

    const decoratedAction$ = action$
        .map(action => story$.map(story => ({ ...action, story })))
        .flatten();

    return {
        DOM: view(story$),
        action$: decoratedAction$,
        router: navigate$
    };
}

export default StoryItem;
