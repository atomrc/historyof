import xs from "xstream";
import {div, span, h1, table, tr, td, i, a} from "@cycle/dom";
import isolate from "@cycle/isolate";

import Story from "./Story";
import StoryForm from "../StoryForm";
import StoriesList from "./StoriesList";
import model from "./model";

function intent(DOM, storyAction$, formAction$) {
    const removeAction$ = storyAction$
        .filter(action => action.type === "remove")

    const navigate$ = DOM
        .select("a")
        .events("click")
        .map(ev => {
            ev.preventDefault()
            return ev;
        })
        .map(ev => ev.ownerTarget.pathname);


    return {
        createAction$: formAction$
            .filter(action => action.type === "create")
            .map(action => action.story),
        updateAction$: formAction$
            .filter(action => action.type === "update")
            .map(action => action.story),
        removeAction$,
        navigate$
    };
}

function render(editedStory$, readStory$, user$, stories$, storiesListView$, storyReader$, formView$, router) {
    return xs
        .combine(
            editedStory$,
            readStory$,
            user$,
            stories$,
            storiesListView$,
            storyReader$,
            formView$
        )
        .map(([editedStory, readStory, user, stories, storiesListView, storyReader, formView]) => {
            const mainView = editedStory ?
                formView:
                readStory ? storyReader : null;

            const reader = readStory ?
                    div("#story-container", [storyReader]) :
                    div();

            return div(".timeline", [
                div(".timeline-header", [
                    table(".fluid-content", [
                        tr([
                            td([
                                h1((user || {}).nickname + "'s timeline"),
                                span(stories.length + " stories")
                            ]),
                            td([
                                a(".flat-button.show-form", {
                                    props: { href: router.createHref("/story/create") }
                                }, [
                                    i(".fa.fa-book"),
                                    " I feel like writting :)"
                                ])
                            ])
                        ])
                    ])
                ]),
                div(".timeline-content", [
                    storiesListView,
                    div(".main", [mainView])
                ])
            ])
        });
}

function Timeline(sources) {
    const {DOM, api, router, props} = sources;
    const { user$ } = props;

    const storyActionProxy$ = xs.create();
    const storyFormActionProxy$ = xs.create();

    const editRoute$ = router.define({
        "/story/create": { date: new Date() },
        "/story/:id/edit": id => id,
        "*": false
    });

    const readRoute$ = router.define({
        "/story/:id": id => id,
        "*": false
    });

    const edit$ = editRoute$
        .map(({ value }) => value)
        .remember();

    const read$ = readRoute$
        .map(({ value }) => value)
        .remember();

    const {
        createAction$,
        updateAction$,
        removeAction$,
        navigate$
    } = intent(DOM, storyActionProxy$, storyFormActionProxy$);

    const {
        editedStory$,
        readStory$,
        stories$
    } = model(createAction$, updateAction$, edit$, read$, removeAction$, api);

    const storiesList = StoriesList({ ...sources, stories$: stories$, selectedElement$: readStory$ });
    const storyReader = Story({ ...sources, story$: readStory$, options$: xs.of({ full: true }) });
    const storyForm = isolate(StoryForm)({DOM, props: { story$: editedStory$ }});

    storyActionProxy$.imitate(storyReader.action$);
    storyFormActionProxy$.imitate(storyForm.action$);

    const apiCreateRequest$ = createAction$
        .map(story => ({
            action: "createStory",
            params: { story }
        }))

    const apiUpdateRequest$ = updateAction$
        .map(story => ({
            action: "updateStory",
            params: { story }
        }))

    const apiRemoveRequest$ = removeAction$
        .map(action => ({ action: "removeStory", params: { story: action.story } }))

    const apiFetchStoriesRequest$ = user$
        .filter(user => user)
        .mapTo({ action: "fetchStories" });

    const storySaved$ = api
        .select("createStory, updateStory")
        .done$;

    const backToStory$ = storySaved$
        .map(response => "/me/story/" + response.id)

    return {
        DOM: render(editedStory$, readStory$, user$, stories$, storiesList.DOM, storyReader.DOM, storyForm.DOM, router),
        api: xs.merge(apiRemoveRequest$, apiCreateRequest$, apiUpdateRequest$, apiFetchStoriesRequest$),
        router: xs.merge(navigate$, storyForm.router, storyReader.router, storiesList.router, backToStory$)
    };
}

export default Timeline;
