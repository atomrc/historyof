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
        .map(action => (stories) => remove(stories, action.params.story))

    const addReducer$ = addAction$
        .map(story => (stories) =>  add(stories, story))

    const resetReducer$ = initialStories$
        .map((stories) => () => stories);

    const reducer$ = xs
        .merge(resetReducer$, removeReducer$, addReducer$);

    const stories$ = reducer$
        .fold((stories, reduceFn) => reduceFn(stories), []);

    const editedStory$ = xs
        .combine(stories$, edit$)
        .map(([stories, storyData]) => {
            if (!storyData) {
                return null;
            }
            if (typeof storyData === "object") {
                return storyData;
            }

            const story = stories
                .filter(story => story.id === storyData)

            return story[0] || {};
        });

    return {
        editedStory$,
        stories$
    };
}

export default model;
