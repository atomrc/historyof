import xs from "xstream";
import {div, span, h1, table, tr, td, i, a} from "@cycle/dom";
import isolate from "@cycle/isolate";

import Story from "./Story";
import StoryForm from "./StoryForm";
import StoriesList from "./StoriesList";

function intent(DOM) {
    const navigate$ = DOM
        .select("a")
        .events("click")
        .map(ev => {
            ev.preventDefault()
            return ev;
        })
        .map(ev => ev.ownerTarget.pathname);

    return { navigate$ };
}

function render(user$, stories$, mode$, storiesListView$, reader$, editor$, router) {
    return xs
        .combine(
            user$,
            stories$,
            mode$,
            storiesListView$,
            reader$,
            editor$
        )
        .map(([user, stories, mode, storiesListView, reader, editor]) => {

            const mainView = mode === "read" ? reader : editor;

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
    const {DOM, router, props} = sources;
    const { user$, stories$ } = props;

    const storyActionProxy$ = xs.create();
    const storyFormActionProxy$ = xs.create();

    const edit$ = router.define({
            "/story/create": { date: new Date() },
            "/story/:id/edit": id => id,
            "*": false
        })
        .map(({ value }) => value)
        .remember();

    const read$ = router.define({
            "/story/:id": id => id,
            "*": false
        })
        .map(({ value }) => value)
        .remember();

    const { navigate$ } = intent(DOM);

    const editedStory$ = xs
        .combine(stories$, edit$)
        .map(([stories, id]) => {
            if (typeof id === "string") {
                return stories.filter(s => s.id === id)[0];
            }
            return id;
        })

    const readStory$ = xs
        .combine(stories$, read$)
        .map(([stories, id]) => stories.filter(s => s.id === id)[0]);

    const mode$ = editedStory$
        .map(editedStory => editedStory ? "edit" : "read")

    const storiesList = StoriesList({ ...sources, stories$: stories$, selectedId$: read$ });
    const storyReader = Story({ ...sources, story$: readStory$, options$: xs.of({ full: true }) });
    const storyForm = StoryForm({DOM, props: { story$: editedStory$ }});

    storyActionProxy$.imitate(xs.merge(storiesList.action$, storyReader.action$));
    storyFormActionProxy$.imitate(storyForm.action$);

    return {
        DOM: render(user$, stories$, mode$, storiesList.DOM, storyReader.DOM, storyForm.DOM, router),
        router: xs.merge(navigate$, storyForm.router, storyReader.router, storiesList.router),
        action$: storyActionProxy$
    };
}

export default Timeline;
