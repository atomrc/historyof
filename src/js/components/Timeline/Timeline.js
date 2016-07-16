import xs from "xstream";
import {div, span, ul, h1, table, tr, td, i, a} from "@cycle/dom";
import StoryForm from "../StoryForm";
import StoryItem from "../StoryItem";
import isolate from "@cycle/isolate";
import model from "./model";

function intent(DOM, itemActions$, formAction$) {
    const showFormAction$ = DOM
        .select("button.show-form")
        .events("click");

    const removeAction$ = itemActions$
        .filter(action => action.type === "remove")

    const navigate$ = DOM
        .select("a")
        .events("click")
        .map(ev => {
            ev.preventDefault()
            return ev;
        })
        .map(ev => ev.target.pathname);


    return {
        showFormAction$,
        addAction$: formAction$
            .filter(action => action.type === "add")
            .map(action => action.story),
        removeAction$,
        navigate$
    };
}

function render(editedStory$, user$, itemViews$, formView$) {
    return xs
        .combine(
            editedStory$,
            user$,
            itemViews$,
            formView$
        )
        .map(([editedStory, user, itemViews, formView]) => {
            const form = editedStory ? 
                div("#form-container", {
                    style: {
                        opacity: "0",
                        transition: "opacity .5s",
                        delayed: { opacity: "1" },
                        remove: { opacity: "0" }
                    }
                }, [formView]) :
                null;

            return div(".timeline", [
                div(".timeline-header", [
                    table(".fluid-content", [
                        tr([
                            td([
                                h1(user.nickname + "'s timeline"),
                                span(itemViews.length + " stories")
                            ]),
                            td([
                                a(".flat-button.show-form", {
                                    props: { href: "/me/story/create" }
                                }, [
                                    i(".fa.fa-book"),
                                    " I feel like writting :)"
                                ])
                            ])
                        ])
                    ])
                ]),
                ul(itemViews),
                form
            ])
        });
}

function createStoryItem(DOM) {
    return (story) => {
        const isolatedItem = isolate(StoryItem, "story-" + story.id)({DOM, props: { story$: xs.of(story)}});
        return {
            ...isolatedItem,
            action$: isolatedItem
                .action$
                .map(action => ({ type: action.type, params: { story } }))
        };
    };
}

function Timeline({DOM, api, props}) {

    const { user$, edit$ = xs.of(null) } = props;

    const itemActionProxy$ = xs.create();
    const storyFormActionProxy$ = xs.create();

    const {
        showFormAction$,
        addAction$,
        removeAction$,
        navigate$
    } = intent(DOM, itemActionProxy$, storyFormActionProxy$);

    const {
        editedStory$,
        stories$
    } = model(showFormAction$, addAction$, edit$, removeAction$, api);

    const storyItems$ = stories$.map(stories => stories.map(createStoryItem(DOM)))

    const itemsAction$ = storyItems$
        .map((items) => items.map(item => item.action$))
        .map(actions => xs.merge(...actions))
        .flatten()

    const storyForm = isolate(StoryForm)({DOM, props: { story$: editedStory$ }});

    const itemNavigate$ = storyItems$
        .map(items => items.map(i => i.router))
        .map(navigates => xs.merge(...navigates))
        .flatten();

    const itemViews$ = storyItems$.map(items => items.map(i => i.DOM));

    itemActionProxy$.imitate(itemsAction$);
    storyFormActionProxy$.imitate(storyForm.action$);

    const apiAddRequest$ = addAction$
        .map(story => ({ action: "createStory", params: { story } }))

    const apiRemoveRequest$ = removeAction$
        .map(action => ({ action: "removeStory", params: { story: action.params.story } }))

    const apiFetchStoriesRequest$ = stories$
        .filter(stories => stories.length === 0)
        .mapTo({ action: "fetchStories" });

    return {
        DOM: render(editedStory$, user$, itemViews$, storyForm.DOM),
        api: xs.merge(apiRemoveRequest$, apiAddRequest$, apiFetchStoriesRequest$),
        router: xs.merge(navigate$, itemNavigate$, storyForm.router)
    };
}

export default Timeline;
