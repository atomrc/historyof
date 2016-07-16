import xs from "xstream";
import uuid from "uuid";

function remove(stories, storyToRm) {
    return stories.filter((story) => story.id !== storyToRm.id);
}

function add(stories, story) {
    return stories.concat(Object.assign({}, story, { id: uuid.v1() }));
}

function model(showFormAction$, addAction$, edit$, removeAction$, api) {
    const initialStories$ = api
        .filter(({ request }) => request.action === "fetchStories")
        .map(({ response$ }) =>
            response$.replaceError(error => xs.of({ error }))
        )
        .flatten()

    const removeReducer$ = removeAction$
        .map(action => (stories) => remove(stories, action.story))

    const addReducer$ = addAction$
        .map(story => (stories) =>  add(stories, story))

    const resetReducer$ = initialStories$
        .map((stories) => () => stories);

    const reducer$ = xs
        .merge(resetReducer$, removeReducer$, addReducer$);

    const stories$ = reducer$
        .fold((stories, reduceFn) => reduceFn(stories), []);

    const editedStory$ = edit$
        .map(storyData => {
            if (!storyData) {
                return xs.of(null);
            }
            if (typeof storyData === "object") {
                return xs.of(storyData);
            }

            return stories$
                .filter(stories => stories.length > 0)
                .take(1)
                .map(stories => {
                    const story = stories.filter(story => story.id === storyData)
                    return story[0] || {};
                })
        })
        .flatten()

    return {
        editedStory$,
        stories$
    };
}

export default model;
