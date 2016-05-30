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

function model({editAction$, addAction$}) {
    const resetAction$ = addAction$.map(() => ({}));

    return xs
        .merge(editAction$, resetAction$)
        .startWith({});
}

function view(editedStory$) {
    return editedStory$
        .map(editedStory => div([
            form(".story-form", [
                input({ props: { name: "title", value: editedStory.title || "" }}),
                input({ props: { type: "submit", value: "Save" }})
            ])
        ]));
}

function StoryForm({DOM}) {
    const {addAction$, editAction$} = intent(DOM);
    const state$ = model({addAction$, editAction$});
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
