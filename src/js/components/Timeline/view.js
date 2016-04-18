import {Observable} from "rx";
import {div, ul} from "@cycle/dom";

function view(storyItems$, storyForm$) {
    return Observable
        .combineLatest(storyItems$, storyForm$)
        .map(([storyItems, storyForm]) => div(".timeline", [
            storyItems.length + " stories",
            ul(storyItems.map(item => item.DOM)),
            storyForm
        ]));
}

export default view;
