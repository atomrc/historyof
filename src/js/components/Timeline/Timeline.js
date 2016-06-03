import xs from "xstream";
import {div, span, ul} from "@cycle/dom";
import StoryForm from "../StoryForm";
import StoryItem from "../StoryItem";
import isolate from "@cycle/isolate";
import model from "./model";

function intent(itemActions$, addAction$) {

    const removeAction$ = itemActions$
        .filter(action => action.type === "remove");

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
    return (story) => {
        const isolatedItem = isolate(StoryItem)({DOM, props: { story$: xs.of(story)}});
        return {
            DOM: isolatedItem.DOM,
            action$: isolatedItem
                .action$
                .map(action => ({ action: action.type, params: { story } }))
        };
    };
}

function Timeline({DOM, props}) {
    const { stories$ } = props;
    const itemActionProxy$ = xs.createMimic();

    const storyForm = isolate(StoryForm)({DOM});

    const { addAction$, removeAction$ } = intent(itemActionProxy$, storyForm.addAction$);
    const storiesModel$ = model(addAction$, removeAction$, stories$);

    const storyItems$ = storiesModel$
        .map(stories => stories.map(createStoryItem(DOM)))
        .remember();

    const itemsAction$ = storyItems$
        .map((items) => items.map(item => item.action$))
        .map(removeActions => xs.merge(...removeActions))
        .flatten()

    const itemViews$ = storyItems$.map(items => items.map(i => i.DOM));
    const vtree$ = render(itemViews$, storyForm.DOM);

    itemActionProxy$.imitate(itemsAction$);

    return {
        DOM: vtree$,
        api: addAction$
            .map(story => ({ action: "createStory", params: { story } }))
    };
}

export default Timeline;
