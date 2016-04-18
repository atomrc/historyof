import {Observable} from 'rx';
import {div, input} from '@cycle/dom';
import assign from "object-assign";

function intent(DOM) {
    const keyup$ = DOM.select("input")
        .events("keyup");

    const editAction$ = keyup$
        .filter(ev => ev.key !== "Enter")
        .map(ev => ({ [ev.target.name]: ev.target.value }))

    const addAction$ = keyup$
        .filter(ev => ev.key === "Enter")
        .map(() => "add");

    return {addAction$, editAction$};
}

function model({editAction$, addAction$}) {
    return Observable
        .merge(editAction$, addAction$)
        .scan((acc, value) => {
            if (value === "add") {
                return {};
            }
            return assign({}, acc, value);
        })
        .startWith({});
}

function view(editedStory$) {
    return editedStory$
        .map(editedStory => div([
            input({ name: "title", value: editedStory.title || "" }),
            input({ name: "test", value: editedStory.test || ""  })
        ]));
}

function StoryForm({DOM}) {
    const action = intent(DOM);
    const state$ = model(action);
    const vTree$ = view(state$);

    const storyToAdd$ = state$.filter((story) => story.title && story.test);
    return {
        DOM: vTree$,
        action$: action
            .addAction$
            .withLatestFrom(storyToAdd$, (action, story) => story)
            .map(story => ({ type: "add", story: story }))
    };
}

export default StoryForm;
