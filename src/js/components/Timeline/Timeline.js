import {Observable, Subject} from "rx";
import isolate from "@cycle/isolate";
import StoryItem from "../StoryItem";
import StoryForm from "../StoryForm";
import model from "./model";
import view from "./view";

function Timeline({DOM, stories$}) {
    const proxyItemAction$ = new Subject();
    const storiesModel$ = model(proxyItemAction$, stories$);

    const storyItems$ = storiesModel$
        .map((stories) =>
            stories.map((story) => {
                const isolatedItem = isolate(StoryItem)({DOM, story$: Observable.just(story)});
                return {
                    DOM: isolatedItem.DOM,
                    action$: isolatedItem.action$.map(action => ({ type: action.type, story: story }))
                };
            })
        ).shareReplay(1);

    const storyItemsAction$ = storyItems$.flatMap(
        (items) => Observable.merge(items.map(item => item.action$))
    );
    const storyForm = isolate(StoryForm)({DOM});
    const storyFormAction$ = storyForm.action$;

    Observable.merge(storyItemsAction$, storyFormAction$).subscribe(proxyItemAction$);

    const vTree$ = view(storyItems$, storyForm.DOM);

    return {
        DOM: vTree$,
        action$: proxyItemAction$
    };
}

export default Timeline;
