import xs from "xstream";
import {div, span, ul} from "@cycle/dom";

function view(storyItems$, storyForm$) {
    return xs
        .combine((storyItems, storyForm) => ({ storyItems, storyForm }), storyItems$, storyForm$)
        .map(({storyItems, storyForm}) => div(".timeline", [
            span(".header", storyItems.length + " stories"),
            ul(storyItems.map(item => item.DOM)),
            storyForm
        ]));
}

export default view;
