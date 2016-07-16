import xs from "xstream";
import uuid from "uuid";

function remove(stories, storyToRm) {
    return stories.filter((story) => story.id !== storyToRm.id);
}

function add(stories, story) {
    return stories.concat(Object.assign({}, story, { id: uuid.v1() }));
}

function model(showFormAction$, createAction$, updateAction$, edit$, removeAction$, api) {
    const initialStories$ = api
        .filter(({ request }) => request.action === "fetchStories")
        .map(({ response$ }) =>
            response$.replaceError(error => xs.of({ error }))
        )
        .flatten()

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
            if (s1.date === s2.date) { return 0; }
            return s1.date < s2.date ? 1 : -1;
        }));

    const groupedStories$ = stories$
        .map(stories => {
            const groups = {};
            const years = [];
            for (var story of stories) {
                const year = story.date.getFullYear();
                groups[year] = groups[year] ? groups[year] : [];

                groups[year].push(story);
            }

            for (var year of Object.keys(groups)) {
                years.push({ year: year, stories: groups[year] });
            }
            return years;
        });

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
        stories$,
        years$: groupedStories$
    };
}

export default model;
