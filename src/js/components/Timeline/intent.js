import {Observable} from "rx";
import isolate from "@cycle/isolate";
import StoryItem from "../StoryItem";
import StoryForm from "../StoryForm";

function intent(stories$, DOM) {
    const storyItems$ = stories$
        .map((stories) =>
            stories.map((story) => {
                const isolatedItem = isolate(StoryItem)({DOM, story$: Observable.just(story)});
                return {
                    DOM: isolatedItem.DOM,
                    action$: isolatedItem
                        .action$
                        .map(action => ({ type: action.type, story: story }))
                };
            })
        ).shareReplay(1);

    const storyForm = isolate(StoryForm)({DOM});

    const storyItemAction$ = storyItems$.flatMap(
        (items) => Observable.merge(items.map(item => item.action$))
    );
    const storyFormAction$ = storyForm.action$;

    return {
        actions$: Observable.merge(storyItemAction$, storyFormAction$),

        components: {
            storyItems$: storyItems$,
            storyForm: storyForm
        }
    };
}

export default intent;
