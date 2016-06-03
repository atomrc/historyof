import xs from "xstream";
import uuid from "uuid";

function remove(stories, storyToRm) {
    return stories.filter((story) => story.id !== storyToRm.id);
}

function add(stories, story) {
    return stories.concat(Object.assign({}, story, { id: uuid.v1() }));
}

function model(addAction$, removeAction$, stories$) {
    const removeReducer$ = removeAction$
        .map(action => (stories) => remove(stories, action.params.story))

    const addReducer$ = addAction$
        .map(story => (stories) =>  add(stories, story))

    const resetReducer$ = stories$
        .map((stories) => () => stories);

    const reducer$ = xs
        .merge(resetReducer$, removeReducer$, addReducer$);

    return reducer$
        .fold((stories, reduceFn) => reduceFn(stories), []);
}

export default model;
