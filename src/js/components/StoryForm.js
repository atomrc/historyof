import {Observable} from 'rx';
import {div, input} from '@cycle/dom';
import assign from "object-assign";

function intent(DOM) {
    const keyup$ = DOM.select("input")
        .events("keyup");

    const editAction$ = keyup$
        .filter(ev => ev.key !== "Enter")
        .map(ev => ({ [ev.target.name]: ev.target.value }))

    const addAction$ = keyup$.filter(ev => ev.key === "Enter");

    return {addAction$, editAction$};
}

function model({editAction$, addAction$}) {
    return Observable.merge(editAction$, addAction$)
        .scan((acc, value) => {
            if (value.type === "add") {
                return {};
            }
            return assign({}, acc, value);
        })
        .startWith({});
}

function view(state$) {
    return state$
        .map(state => div([
            input({ name: "title", value: state.title }),
            input({ name: "test", value: state.test })
        ]));
}

function StoryForm({DOM}) {
    const action = intent(DOM);
    const state$ = model(action);
    const vTree$ = view(state$);

    return {
        DOM: vTree$,
        action$: action
            .addAction$
            .map(() => state$)
            .mergeAll()
            .map(state => ({ type: "add", story: state }))
    };
}

export default StoryForm;
