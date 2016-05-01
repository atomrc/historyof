import {Observable} from "rx";

function intent(storyItems$, storyForm) {

    const removeAction$ = storyItems$
        .map((items) => items.map(item => item.removeAction$))
        .flatMapLatest(removeActions => Observable.merge(removeActions));

    const editAction$ = storyItems$.flatMapLatest(
        (items) => Observable.merge(items.map(item => item.editAction$))
    );

    const addAction$ = storyForm.addAction$;

    return {
        addAction$,
        editAction$,
        removeAction$
    };
}

export default intent;
