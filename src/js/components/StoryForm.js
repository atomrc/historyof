import xs from "xstream";
import {form, input, div, a, button, textarea} from "@cycle/dom";
import assign from "object-assign";

function intent(DOM) {
    const update$ = DOM
        .select("input")
        .events("keyup")
        .map(ev => ({ [ev.target.name]: ev.target.value }));

    const submit$ = DOM
        .select("#story-form")
        .events("submit")
        .map(ev => {
            ev.preventDefault()
            return ev;
        })
        .mapTo("add");

    const navigate$ = DOM
        .select("a")
        .events("click")
        .map(ev => {
            ev.preventDefault()
            return ev;
        })
        .map(ev => ev.target.pathname);

    return {update$, submit$, navigate$};
}

function model(story$, update$) {
    return xs
        .merge(story$, update$)
        .remember();
}

function view(state$) {
    return state$
        .map(story => story ? story : {})
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
                        a(".cancel", { props: { href: "/me" }}, "Cancel")
                    ])
                ])
            ])
        );
}

function StoryForm({ DOM, props }) {
    const { story$ } = props;

    const {submit$, update$, navigate$} = intent(DOM);
    const state$ = model(story$, update$);
    const vTree$ = view(state$);

    const storyToAdd$ = state$.filter(story => story.title);

    const addActionSink$ = submit$
        .mapTo(storyToAdd$)
        .flatten()
        .map(story => assign({}, story, { date: new Date() }))
        .map(story => ({ type: "add", story: story }));

    return {
        DOM: vTree$,
        action$: addActionSink$,
        router: navigate$
    };
}

export default StoryForm;
