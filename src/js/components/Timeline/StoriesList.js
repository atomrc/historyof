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
    const {stories$, selectedElement$} = sources;

    const viewDatas$ = xs
        .combine(stories$, selectedElement$.startWith(null))
        .map(([stories, element]) => {
            return stories.map(story => ({ key: "story-element-" + story.id, story$: xs.of(story), options$: xs.of({ selected: story.id === (element || {}).id })}));
        });

    const storyItems$ = viewDatas$
        .map(datas => datas.map(data => {
            var element = isolate(Story)({ ...sources, ...data })
            return {
                ...element,
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
