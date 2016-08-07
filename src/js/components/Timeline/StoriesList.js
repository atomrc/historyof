import Collection from '@cycle/collection';
import {div} from "@cycle/dom";

import Story from "./Story";

function StoriesList(sources) {
    const {stories$} = sources;

    const storyItems$ = Collection.gather(
        Story,
        sources,
        stories$.map(stories => stories.map(story => ({ id: story.id, story$: story })))
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
