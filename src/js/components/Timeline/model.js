import xs from "xstream";

function model(edit$, read$) {
    return {
        editedStory$: xs.empty(),
        readStory$: xs.empty()
    }

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
