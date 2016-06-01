import xs from "xstream";
import uuid from "uuid";
import assign from "object-assign";

function model(addAction$, removeAction$, stories$) {
    const removeReducer$ = removeAction$.map(action => (stories) => {
        return stories.filter((story) => story.id !== action.story.id);
    });

    const addReducer$ = addAction$.map(story => (stories) => {
        return stories.concat(assign({}, story, { id: uuid.v1() }));
    });

    const resetReducer$ = stories$
        .map((stories) => () => stories);

    const reducer$ = xs
        .merge(resetReducer$, removeReducer$, addReducer$);

    return reducer$
        .fold((stories, reduceFn) => reduceFn(stories), []);
}

export default model;
