import {div, a, header, em, strong, p, i} from '@cycle/dom';

function intent(DOM) {
    const removeAction$ = DOM
        .select(".remove")
        .events("click")
        .mapTo({ type: "remove" });

    const navigate$ = DOM
        .select("a.edit")
        .events("click")
        .map(ev => {
            ev.preventDefault()
            return ev;
        })
        .map(ev => ev.ownerTarget.pathname);

    return {
        action$: removeAction$,
        navigate$
    };
}

function view(story$, router) {
    return story$
        .map((story) => div(".story", [
            header([
                div(".infos", [
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
                    div([strong(".title", story.title)]),
                    div(".actions", [
                        a(".edit", { props: { href: router.createHref("/story/" + story.id + "/edit") } }, [
                            i(".fa.fa-pencil")
                        ]),
                        " ",
                        a(".remove", { props: { href: "javascript:void(0)", "storyid": story.id } }, [
                            i(".fa.fa-trash")
                        ])
                    ])
                ])
            ]),
            p(".toggle", [
                story.description
            ])
                //<p className={"toggle " + classes} dangerouslySetInnerHTML={{__html: (story.description || "").replace(/\n/g, "<br>")}}></p> 
        ]));
}

function StoryItem({DOM, router, story$}) {
    const { action$, navigate$ } = intent(DOM);

    const decoratedAction$ = action$
        .map(action => story$.map(story => ({ ...action, story })))
        .flatten();

    return {
        DOM: view(story$, router),
        action$: decoratedAction$,
        router: navigate$
    };
}

export default StoryItem;
