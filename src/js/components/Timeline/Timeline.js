import xs from "xstream";
import StoryForm from "../StoryForm";
import StoryItem from "../StoryItem";
import isolate from "@cycle/isolate";
import model from "./model";
import view from "./view";
import intent from "./intent";

function createStoryItem(DOM) {
    return function (story) {
        const isolatedItem = isolate(StoryItem)({DOM, story$: xs.of(story)});
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
    const vTree$ = view(storyItems$, storyForm.DOM);

    storiesProxy$.imitate(storiesModel$);

    return {
        DOM: vTree$,
        api: addAction$
            .map(story => ({ action: "createStory", params: { story } }))
    };
}

export default Timeline;
