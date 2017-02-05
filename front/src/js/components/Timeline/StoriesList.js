import xs from "xstream";
import {div} from "@cycle/dom";
import isolate from "@cycle/isolate";

import Story from "./Story";

function pluck(sources$, attr) {
    return sources$.map(sources => sources.map(source => source[attr]))
}
function merge(sources$, attr) {
    return pluck(sources$, attr)
        .map(attrs => xs.merge(...attrs))
        .flatten()
}

function wrapper(key) {
    return function wrap(view) {
        return div(".list-element", {
            key: key,
            style: {
                opacity: "0",
                transition: "opacity .3s",
                delayed: { opacity: "1" }
            }
        },[view]);
    };
}

function StoriesList(sources) {
    const {stories$, selectedId$} = sources;

    const sortedStories$ = stories$
        .map(stories => stories.sort(function sortStories(s1, s2) {
            if (s1.date === s2.date) {
                return 0;
            }
            return s1.date < s2.date ? 1 : -1;
        }));

    const viewDatas$ = xs
        .combine(sortedStories$, selectedId$.startWith(null))
        .map(([stories, selectedId]) => {
            return stories.map(story => ({
                id: story.id,
                key: "story-element-" + story.id,
                story$: xs.of(story),
                options$: xs.of({ selected: story.id === selectedId })
            }));
        });

    const storyItems$ = viewDatas$
        .map(datas => datas.map(data => {
            var element = isolate(Story)({ ...sources, ...data })
            return {
                ...element,
                action$: element.action$.map(action => ({ ...action, params: data.id })),
                DOM: element.DOM.map(wrapper(data.key))
            };
        }))
        .remember()

    const itemViews$ = pluck(storyItems$, "DOM");
    const itemNavigate$ = merge(storyItems$, "router");
    const itemAction$ = merge(storyItems$, "action$");

    return {
        DOM: itemViews$.map(views => div(".stories-list", views)),
        router: itemNavigate$,
        action$: itemAction$
    };
}

export default StoriesList;
