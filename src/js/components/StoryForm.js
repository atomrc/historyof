import xs from "xstream";
import {form, input, div, a, button, textarea} from "@cycle/dom";
import assign from "object-assign";

function intent(DOM) {
    const editAction$ = DOM
        .select("input")
        .events("change")
        .map(ev => ({ [ev.target.name]: ev.target.value }));

    const addAction$ = DOM
        .select("#story-form")
        .events("submit")
        .map(ev => {
            ev.preventDefault()
            return ev;
        })
        .mapTo("add");

    const cancelAction$ = DOM
        .select(".cancel")
        .events("click")
        .mapTo("cancel");

    return {addAction$, editAction$, cancelAction$};
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
            form("#story-form", [
                div([
                    input({ props: {
                        placeholder: "Title",
                        name: "title",
                        value: story.title || ""
                    }})
                ]),
                div([
                    textarea({ props: {
                        rows: "2",
                        name: "description",
                        placeholder: "Your story",
                        value: story.description || ""
                    }})
                ]),
                div(".actions", [
                    button(".flat-button", { props: { type: "submit" }}, "Save"),
                    a(".cancel", { props: { href: "#" }}, "Cancel")
                ])
            ])
        ]));
}

function StoryForm({ DOM, props }) {
    const { story$ } = props;

    const {addAction$, editAction$, cancelAction$} = intent(DOM);
    const state$ = model({story$, addAction$, editAction$});
    const vTree$ = view(state$);

    const storyToAdd$ = state$.filter(story => story.title);

    const cancelActionSink$ = cancelAction$
        .mapTo({ type: "cancel" });

    const addActionSink$ = addAction$
        .mapTo(storyToAdd$)
        .flatten()
        .map(story => assign({}, story, { date: new Date() }))
        .map(story => ({ type: "add", story: story }));

    return {
        DOM: vTree$,
        action$: xs.merge(cancelActionSink$, addActionSink$)
    };
}

export default StoryForm;
