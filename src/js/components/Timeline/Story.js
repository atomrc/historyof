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

function view(story$, router, full) {
    return story$
        .map((story) => {
            if (!story) { return null; }
            const text = full ? p(story.description) : null;
            const title = full ? h1(story.title) : strong(story.title);

            return div(".story", [
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

function Story({DOM, router, story$, full}) {
    const { navigate$, remove$ } = intent(DOM);

    return {
        DOM: view(story$, router, full),
        router: navigate$,
        action$: remove$
    };
}

export default Story;
