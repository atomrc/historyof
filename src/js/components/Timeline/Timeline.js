import {Observable, ReplaySubject} from "rx";
import StoryForm from "../StoryForm";
import StoryItem from "../StoryItem";
import isolate from "@cycle/isolate";
import model from "./model";
import view from "./view";
import intent from "./intent";

function createStoryItem(DOM) {
    return function (story) {
        const isolatedItem = isolate(StoryItem)({DOM, story$: Observable.just(story)});
        return {
            DOM: isolatedItem.DOM,
            removeAction$: isolatedItem
                .removeAction$
                .map(action => ({ type: action.type, story: story }))
        };
    };
}

function Timeline({DOM, stories$}) {
    const storiesProxy$ = new ReplaySubject();

    const storyForm = isolate(StoryForm)({DOM});
    const storyItems$ = storiesProxy$.map(stories =>
        stories.map(createStoryItem(DOM))
    )
    .shareReplay();

    const { addAction$, removeAction$ } = intent(storyItems$, storyForm);
    const storiesModel$ = model(addAction$, removeAction$, stories$);
    const vTree$ = view(storyItems$, storyForm.DOM);

    storiesModel$.subscribe(storiesProxy$);

    return {
        DOM: vTree$,
        api: addAction$
            .map(story => ({ action: "createStory", params: { story } }))
    };
}

export default Timeline;
