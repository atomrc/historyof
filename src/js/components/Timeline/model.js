import {Observable} from "rx";
import uuid from "uuid";
import assign from "object-assign";

function model(addAction$, removeAction$, stories$) {
    const removeReducer$ = removeAction$.map(action => (stories) => {
        return stories.filter((story) => story.id !== action.story.id);
    });

    const addReducer$ = addAction$.map(action => (stories) => {
        return stories.concat(assign({}, action.story, { id: uuid.v1() }));
    });

    const reducer$ = Observable
        .merge(removeReducer$, addReducer$)
        .startWith(i => i);

    return stories$
        .concat(reducer$)
        .scan((stories, reduceFn) => reduceFn(stories));
}

export default model;
