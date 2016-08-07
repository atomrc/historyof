import xs from "xstream";
import {div, a, header, em, h1, i, p, strong} from '@cycle/dom';

function intent(DOM) {
    const navigate$ = DOM
        .select("a")
        .events("click")
        .map(ev => {
            ev.preventDefault()
            return ev;
        })
        .map(ev => ev.ownerTarget.pathname);

    const remove$ = xs.empty();

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
            const title = options.full ? h1(story.title) : strong(story.title);

            return div(".story", { class: { selected: options.selected } }, [
                header([
                    div(".infos", [
                        a({ props: { href: router.createHref("/story/" + story.id) }}, [
                            title
                        ]),
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
        action$: remove$
    };
}

export default Story;
