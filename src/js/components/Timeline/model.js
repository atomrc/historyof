import uuid from "uuid";
import assign from "object-assign";

function model(action$, stories$) {
    const reducer$ = action$.map(action => (stories) => {
        switch(action.type) {
            case "add":
                return stories.concat(assign({}, action.story, { id: uuid.v1() }));
            case "remove":
                return stories.filter((story) => story.id !== action.story.id);
            default:
                throw new Error("uninplemented item action: "+ action.type);
        }
    });

    return stories$
        .concat(reducer$)
        .scan((stories, reduceFn) => reduceFn(stories));
}

export default model;
