import {Observable, Subject} from 'rx';
import {div, ul} from '@cycle/dom';
import isolate from '@cycle/isolate';
import StoryItem from './StoryItem';
import StoryForm from './StoryForm';
import uuid from "uuid";
import assign from "object-assign";

function model(action$, stories$) {
    const reducer$ = action$.map(action => (stories) => {
        switch(action.type) {
            case "add":
                return stories.concat(assign({}, action.story, { id: uuid.v1() }));
            case "remove":
                return stories.filter((story) => story.id !== action.story.id);
            default:
                throw new Error("uninplemented item action: "+ action.type);
        }
    });

    return stories$
        .concat(reducer$)
        .scan((stories, reduceFn) => reduceFn(stories));
}


function view(storyItems$, storyForm$) {
    return Observable
        .combineLatest(storyItems$, storyForm$)
        .map(([storyItems, storyForm]) => div(".timeline", [
            storyItems.length + " stories",
            ul(storyItems.map(item => item.DOM)),
            storyForm
        ]));
}

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
