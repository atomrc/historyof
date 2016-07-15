import xs from "xstream";
import uuid from "uuid";

function remove(stories, storyToRm) {
    return stories.filter((story) => story.id !== storyToRm.id);
}

function add(stories, story) {
    return stories.concat(Object.assign({}, story, { id: uuid.v1() }));
}

function model(showFormAction$, addAction$, removeAction$, api) {

    const initialStories$ = api
        .filter(({ request }) => request.action === "fetchStories")
        .map(({ response$ }) =>
            response$.replaceError(error => xs.of({ error }))
        )
        .flatten()
        .remember();

    const removeReducer$ = removeAction$
        .map(action => (stories) => remove(stories, action.params.story))

    const addReducer$ = addAction$
        .map(story => (stories) =>  add(stories, story))

    const resetReducer$ = initialStories$
        .map((stories) => () => stories);

    const reducer$ = xs
        .merge(resetReducer$, removeReducer$, addReducer$);

    const stories$ = reducer$
        .fold((stories, reduceFn) => reduceFn(stories), []);

    const showForm$ = showFormAction$
        .mapTo(true)
        .startWith(false);

    return xs
        .combine(showForm$, stories$)
        .map(([showForm, stories]) => ({ showForm, stories }))
}

export default model;
