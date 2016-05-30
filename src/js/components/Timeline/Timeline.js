import xs from "xstream";
import {div, span, ul} from "@cycle/dom";
import StoryForm from "../StoryForm";
import StoryItem from "../StoryItem";
import isolate from "@cycle/isolate";
import model from "./model";

function intent(storyItems$, storyForm) {

    const removeAction$ = storyItems$
        .map((items) => items.map(item => item.removeAction$))
        .map(removeActions => xs.merge(removeActions))
        .flatten();

    const editAction$ = storyItems$
        .map((items) => xs.merge(items.map(item => item.editAction$)))
        .flatten();

    const addAction$ = storyForm.addAction$;

    return {
        addAction$,
        editAction$,
        removeAction$
    };
}

function render(itemViews$, formView$) {
    return xs
        .combine(
            (itemViews, formView) => ({ itemViews, formView }),
            itemViews$,
            formView$
        )
        .map(({itemViews, formView}) => div(".timeline", [
            span(".header", itemViews.length + " stories"),
            ul(itemViews),
            formView
        ]));
}

function createStoryItem(DOM) {
    return function (story) {
        const isolatedItem = isolate(StoryItem)({DOM, props: { story$: xs.of(story)}});
        return {
            DOM: isolatedItem.DOM,
            removeAction$: isolatedItem
                .removeAction$
                .map(action => ({ action: action.type, params: { story } }))
        };
    };
}

function Timeline({DOM, stories$}) {
    const storiesProxy$ = new xs.createWithMemory();

    const storyForm = isolate(StoryForm)({DOM});
    const storyItems$ = storiesProxy$.map(stories =>
        stories.map(createStoryItem(DOM))
    )
    .remember();

    const { addAction$, removeAction$ } = intent(storyItems$, storyForm);
    const storiesModel$ = model(addAction$, removeAction$, stories$);
    storiesProxy$.imitate(storiesModel$);

    const itemViews$ = storyItems$.map(items => items.map(i => i.DOM));
    return {
        DOM: render(itemViews$, storyForm.DOM),
        api: addAction$
            .map(story => ({ action: "createStory", params: { story } }))
    };
}

export default Timeline;
