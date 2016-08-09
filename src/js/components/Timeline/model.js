import xs from "xstream";

function remove(stories, storyToRm) {
    return stories.filter((story) => story.id !== storyToRm.id);
}

function add(stories, story) {
    return stories.concat(story);
}

function find(stories, id) {
    return stories.filter((story) => story.id === id)[0];
}

function model(createAction$, updateAction$, edit$, read$, removeAction$, api) {
    const initialStories$ = api
        .select("fetchStories")
        .done$

    const removeReducer$ = removeAction$
        .map(action => (stories) => remove(stories, action.story))

    const addReducer$ = createAction$
        .map(story => (stories) =>  add(stories, story))

    const updateReducer$ = updateAction$
        .map(story => (stories) => {
            const index = stories.reduce(function (acc, element, index) {
                if (story.id === element.id) {
                    return index;
                }
                return acc;
            }, -1);

            stories[index] = story;
            return stories;
        });

    const resetReducer$ = initialStories$
        .map((stories) => () => stories);

    const reducer$ = xs
        .merge(resetReducer$, removeReducer$, addReducer$, updateReducer$);

    const stories$ = reducer$
        .fold((stories, reduceFn) => reduceFn(stories), [])
        .map(stories => stories.sort((s1, s2) => {
            if (s1.date.getTime() === s2.date.getTime()) {
                return s1.created_at < s2.created_at ? 1 : -1;
            }
            return s1.date.getTime() < s2.date.getTime() ? 1 : -1;
        }));

    const newStory$ = edit$
        .filter(storyData => typeof storyData === "object");

    const editStoryId$ = edit$
        .filter(storyData => typeof storyData === "string")

    const editStory$ = xs
        .combine(editStoryId$, stories$)
        .map(([id, stories]) => find(stories, id));

    const noEdit$ = edit$
        .filter(storyData => !storyData);

    const editedStory$ = xs.merge(newStory$, editStory$, noEdit$);

    const readStory$ = xs.combine(stories$, read$)
        .map(([stories, id]) => find(stories, id))

    return {
        editedStory$,
        readStory$,
        stories$
    };
}

export default model;
