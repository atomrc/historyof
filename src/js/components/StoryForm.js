import xs from "xstream";
import {form, input, div} from "@cycle/dom";
import assign from "object-assign";

function intent(DOM) {
    const editAction$ = DOM
        .select("input")
        .events("change")
        .map(ev => ({ [ev.target.name]: ev.target.value }));

    const addAction$ = DOM
        .select(".story-form")
        .events("submit")
        .map(ev => {
            ev.preventDefault()
            return ev;
        })
        .mapTo("add");

    return {addAction$, editAction$};
}

function model({story$, editAction$, addAction$}) {
    const emptyStory$ = addAction$.map(() => ({}));

    return xs
        .merge(story$, editAction$, emptyStory$)
        .startWith({})
        .remember();
}

function view(state$) {
    return state$
        .map(story => div([
            form(".story-form", [
                input({ props: { name: "title", value: story.title || "" }}),
                input({ props: { type: "submit", value: "Save" }})
            ])
        ]));
}

function StoryForm({ DOM, props }) {
    const { story$ } = props;

    const {addAction$, editAction$} = intent(DOM);
    const state$ = model({story$, addAction$, editAction$});
    const vTree$ = view(state$);

    const storyToAdd$ = state$.filter(story => story.title);

    return {
        DOM: vTree$,
        addAction$: addAction$
            .mapTo(storyToAdd$)
            .flatten()
            .map(story => assign({}, story, { date: new Date() }))
    };
}

export default StoryForm;
