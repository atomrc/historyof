import xs from "xstream";
import {div, a, header, em, h1, i, p, strong, button} from '@cycle/dom';

function intent(DOM) {
    const navigate$ = DOM
        .select("a")
        .events("click")
        .map(ev => {
            ev.preventDefault()
            return ev;
        })
        .map(ev => ev.ownerTarget.pathname);

    const remove$ = DOM
        .select(".remove")
        .events("click")

    return {
        navigate$,
        remove$
    }
}

function view(story$, router, options$) {
    return xs
        .combine(story$, options$)
        .map(([story, options]) => {
            if (!story) { return null; }
            const text = options.full ? p(story.description) : null;
            const title = options.full ?
                h1(story.title) :
                a({ props: { href: router.createHref("/story/" + story.id) }}, [
                    strong(story.title)
                ]);

            return div(".story", {key: "story-" + story.id, class: { selected: options.selected } }, [
                header([
                    div(".infos", [
                        title,
                        div([
                            em(".date", [
                                story.date.toLocaleString(undefined, {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric"
                                })
                            ])
                        ]),
                        div(".actions", [
                            a(".edit", { props: { href: router.createHref("/story/" + story.id + "/edit") } }, [
                                i(".fa.fa-pencil")
                            ]),
                            button(".remove", [
                                i(".fa.fa-trash")
                            ])
                        ])
                    ])
                ]),
                text
            ])
        });
}

function Story({DOM, router, story$, options$}) {
    const { navigate$, remove$ } = intent(DOM);

    return {
        DOM: view(story$, router, options$),
        router: navigate$,
        action$: story$
            .filter(story => !!story)
            .map(story => remove$.mapTo({ type: "remove", params: story.id }))
            .flatten()
    };
}

export default Story;
