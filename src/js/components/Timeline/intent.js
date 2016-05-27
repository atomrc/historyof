import xs from "xstream";

function intent(storyItems$, storyForm) {

    const removeAction$ = storyItems$
        .map((items) => items.map(item => item.removeAction$))
        .map(removeActions => xs.merge(removeActions))
        .flatten();

    const editAction$ = storyItems$
        .map((items) => xs.merge(items.map(item => item.editAction$)))
        .flatten();

    const addAction$ = storyForm.addAction$;

    return {
        addAction$,
        editAction$,
        removeAction$
    };
}

export default intent;
