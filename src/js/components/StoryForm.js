import {Observable} from 'rx';
import {form, input} from '@cycle/dom';

function intent(DOM) {
    const editAction$ = DOM.select("input")
        .events("change")
        .map(ev => ({ [ev.target.name]: ev.target.value }));

    const addAction$ = DOM.select(":root")
        .events("submit")
        .do(ev => ev.preventDefault())
        .map(() => "add");

    return {addAction$, editAction$};
}

function model({editAction$, addAction$}) {
    const resetAction$ = addAction$.map(() => ({}));

    return Observable
        .merge(editAction$, resetAction$)
        .startWith({});
}

function view(editedStory$) {
    return editedStory$
        .map(editedStory => form([
            input({ name: "title", value: editedStory.title || "" }),
            input({ type: "submit", value: "Save" })
        ]));
}

function StoryForm({DOM}) {
    const {addAction$, editAction$} = intent(DOM);
    const state$ = model({addAction$, editAction$});
    const vTree$ = view(state$);

    const storyToAdd$ = state$.filter(story => story.title);

    return {
        DOM: vTree$,
        addAction$: storyToAdd$
            .sample(addAction$)
            .map(story => ({ type: "add", story: story }))
    };
}

export default StoryForm;
