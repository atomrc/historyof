import xs from "xstream";

const reducers = {
    reset: stories => () => stories,
    remove: id => stories => stories.filter((story) => story.id !== id),
    update: newStory => stories => stories
        .filter((story) => story.id !== newStory.id)
        .concat(newStory),
    add: story => stories => stories.concat(story),
    find: id => stories => stories.filter((story) => story.id === id)[0]
}

function getReducer(action) {
    return reducers[action.type](action.param);
}

function model(initialStories$, action$) {
    const resetAction$ = initialStories$
        .map(stories => ({ type: "reset", param: stories }));

    const reducer$ = xs.merge(resetAction$, action$)
        .map(getReducer);

    const stories$ = reducer$
        .fold((stories, reduceFn) => reduceFn(stories), [])

    return stories$.drop(1)
}

function StoriesContainer(sources) {
    const { api, props } = sources;
    const { user$, Child } = props;

    const childActionProxy$ = xs.create();

    const initialStories$ = api
        .select("fetchStories")
        .done$

    const stories$ = model(initialStories$, childActionProxy$);

    const child = Child({ ...sources, props: { user$, stories$ }});

    const apiRequest$ = child
        .action$
        .map(action => {
            const translations = {
                "remove": "removeStory",
                "add": "createStory",
                "update": "updateStory"
            };

            return {
                action: translations[action.type],
                params: action.params
            }
        });

    const fetchStories$ = user$
        .take(1)
        .mapTo({ action: "fetchStories" })

    childActionProxy$.imitate(child.action$);

    return {
        ...child,
        api: xs.merge(fetchStories$, apiRequest$)
    }
}

export default StoriesContainer;
