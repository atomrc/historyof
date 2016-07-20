import xs from "xstream";
import Collection from '@cycle/collection';
import {div, h2 } from "@cycle/dom";

import StoryItem from "./StoryItem";

function render(year$, itemsView$) {
    return xs
        .combine(year$, itemsView$)
        .map(([year, views]) => div(".year", [h2(year.year), div(".soft-box", views)]));
}

function Year(sources) {
    const {year$} = sources;

    const storyItems$ = Collection.gather(
        StoryItem,
        sources,
        year$.map(year => year.stories.map(story => ({ id: story.id, story$: story })))
    );

    const itemViews$ = Collection.pluck(storyItems$, item => item.DOM);

    return {
        DOM: render(year$, itemViews$),
        router: Collection.merge(storyItems$, item => item.router),
        action$: Collection.merge(storyItems$, item => item.action$)
    };
}

export default Year;
