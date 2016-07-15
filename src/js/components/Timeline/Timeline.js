import xs from "xstream";
import {div, span, ul} from "@cycle/dom";
import StoryForm from "../StoryForm";
import StoryItem from "../StoryItem";
import isolate from "@cycle/isolate";
import model from "./model";

function intent(itemActions$, addAction$) {

    const removeAction$ = itemActions$
        .filter(action => action.type === "remove")

    const editAction$ = itemActions$
        .filter(action => action.type === "edit");

    return {
        addAction$,
        editAction$,
        removeAction$
    };
}

function render(itemViews$, formView$) {
    return xs
        .combine(
            itemViews$,
            formView$
        )
        .map(([itemViews, formView]) => div(".timeline", [
            span(".header", itemViews.length + " stories"),
            ul(itemViews),
            formView
        ]));
}

function createStoryItem(DOM) {
    return (story) => {
        const isolatedItem = isolate(StoryItem, "story-" + story.id)({DOM, props: { story$: xs.of(story)}});
        return {
            DOM: isolatedItem.DOM,
            action$: isolatedItem
                .action$
                .map(action => ({ type: action.type, params: { story } }))
        };
    };
}

function Timeline({DOM, api, props}) {
    const { user$ } = props;

    const itemActionProxy$ = xs.create();

    const storyForm = isolate(StoryForm)({DOM, props: { story$: xs.never() }});

    const { addAction$, removeAction$ } = intent(itemActionProxy$, storyForm.addAction$);
    const stories$ = model(addAction$, removeAction$, api);

    const storyItems$ = stories$
        .map(stories => stories.map(createStoryItem(DOM)))
        .remember();

    const itemsAction$ = storyItems$
        .map((items) => items.map(item => item.action$))
        .map(removeActions => xs.merge(...removeActions))
        .flatten()

    const itemViews$ = storyItems$.map(items => items.map(i => i.DOM));

    itemActionProxy$.imitate(itemsAction$);

    const apiAddRequest$ = addAction$
        .map(story => ({ action: "createStory", params: { story } }))

    const apiRemoveRequest$ = removeAction$
        .map(action => ({ action: "removeStory", params: { story: action.params.story } }))

    const apiFetchStoriesRequest$ = xs.of({ action: "fetchStories" });

    return {
        DOM: render(user$, itemViews$, storyForm.DOM),
        api: xs.merge(apiRemoveRequest$, apiAddRequest$, apiFetchStoriesRequest$)
    };
}

export default Timeline;
