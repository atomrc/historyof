import xs from "xstream";
import Collection from '@cycle/collection';
import {div} from "@cycle/dom";

import Story from "./Story";

function StoriesList(sources) {
    const {stories$, selectedElement$} = sources;

    const viewDatas$ = xs
        .combine(stories$, selectedElement$.startWith(null))
        .map(([stories, element]) => {
            return stories.map(story => ({ id: story.id, story$: story, options$: { selected: story.id === (element || {}).id }}));
        });

    const storyItems$ = Collection.gather(
        Story,
        sources,
        viewDatas$
    );

    const itemViews$ = Collection.pluck(storyItems$, item => item.DOM);
    const itemNavigate$ = Collection.merge(storyItems$, item => item.router);
    const itemAction$ = Collection.merge(storyItems$, item => item.action$);

    return {
        DOM: itemViews$.map(views => div(".stories-list", views)),
        router: itemNavigate$,
        action$: itemAction$
    };
}

export default StoriesList;
