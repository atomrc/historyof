import xs from "xstream";
import {div, span, h1, table, tr, td, i, a} from "@cycle/dom";
import Collection from '@cycle/collection';
import isolate from "@cycle/isolate";

import StoryForm from "../StoryForm";
import Year from "../Year";
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

function render(editedStory$, user$, yearsView$, formView$, router) {
    return xs
        .combine(
            editedStory$,
            user$,
            yearsView$,
            formView$
        )
        .map(([editedStory, user, yearsView, formView]) => {
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
                                span(yearsView.length + " stories")
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
                div(".fluid-content.stories-container", yearsView),
                form
            ])
        });
}

function Timeline(sources) {
    const {DOM, api, router, props} = sources;
    const { user$ } = props;

    const yearsActionProxy$ = xs.create();
    const storyFormActionProxy$ = xs.create();

    const match$ = router.define({
        "/": false,
        "/story/create": { date: new Date() },
        "/story/:id/edit": id => id
    });

    const edit$ = match$
        .map(({ value }) => value)
        .remember();

    const {
        showFormAction$,
        createAction$,
        updateAction$,
        removeAction$,
        navigate$
    } = intent(DOM, yearsActionProxy$, storyFormActionProxy$);

    const {
        editedStory$,
        years$,
        stories$
    } = model(showFormAction$, createAction$, updateAction$, edit$, removeAction$, api);

    const yearsItems$ = Collection
        .gather(
            Year,
            sources,
            years$.map(years => years.map(year => ({ id: year.year, year$: { year: year.year, stories: year.stories }})))
        );

    const storyForm = isolate(StoryForm)({DOM, props: { story$: editedStory$ }});

    const itemNavigate$ = Collection.merge(yearsItems$, item => item.router);
    const yearsAction$ = Collection.merge(yearsItems$, item => item.action$);
    const yearsView$ = Collection.pluck(yearsItems$, item => item.DOM);

    yearsActionProxy$.imitate(yearsAction$);
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
        .filter(({ request }) => request.action === "createStory" || request.action === "updateStory")
        .map(({ response$ }) =>
            response$.replaceError(error => xs.of({ error }))
        )
        .flatten()

    return {
        DOM: render(editedStory$, user$, yearsView$, storyForm.DOM, router),
        api: xs.merge(apiRemoveRequest$, apiCreateRequest$, apiUpdateRequest$, apiFetchStoriesRequest$),
        router: xs.merge(navigate$, itemNavigate$, storyForm.router, storySaved$.mapTo("/me"))
    };
}

export default Timeline;
