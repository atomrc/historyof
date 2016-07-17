import xs from "xstream";
import {form, input, div, a, button, textarea, span} from "@cycle/dom";
import uuid from "uuid";

function intent(DOM) {
    const update$ = DOM
        .select("input, textarea")
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

function model(initialStory$, update$, submit$) {
    const resetReducer$ = initialStory$
        .map(story => () => story || {});

    const updateReducer$ = update$
        .map(updates => (story) => ({ ...story, ...updates }))

    const story$ = xs
        .merge(resetReducer$, updateReducer$)
        .fold((acc, reducerFn) => reducerFn(acc), {})

    const submitted$ = xs.merge(
            submit$.mapTo(true),
            initialStory$.mapTo(false)
        )
        .startWith(false);

    return xs
        .combine(story$, submitted$)
        .map(([story, submitted]) => ({ story, submitted }))
        .remember();
}

function view(state$) {
    return state$
        .map(({ story, submitted }) => div([
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
                    div([
                        span((story.date || new Date()).toLocaleString())
                    ]),
                    div(".actions", [
                        button(".flat-button", { props: { type: "submit", disabled: submitted }}, (submitted ? "Saving..." : "Save")),
                        a(".cancel", { props: { href: "/me" }}, "Cancel")
                    ])
                ])
            ])
        );
}

function StoryForm({ DOM, props }) {
    const { story$ } = props;

    const {submit$, update$, navigate$} = intent(DOM);
    const state$ = model(story$, update$, submit$);
    const vTree$ = view(state$);

    const storyToAdd$ = state$
        .filter(({ story }) => story.title)
        .map(({ story }) => story);

    const addActionSink$ = submit$
        .mapTo(storyToAdd$.take(1))
        .flatten()
        .map(story => ({ type: (story.id ? "update" : "create"), story: story }))
        .map(addAction => {
            if (addAction.type === "update") {
                return addAction;
            }
            return { ...addAction, story: { ...addAction.story, id: uuid.v1() }};
        })

    return {
        DOM: vTree$,
        router: navigate$,
        action$: addActionSink$
    };
}

export default StoryForm;
