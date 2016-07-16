import xs from "xstream";
import {div, button, span} from "@cycle/dom";

function render({user, childDOM}) {
    const header = div("#app-header", [
        span(".pseudo", user.nickname),
        button(".logout", "Logout")
    ]);

    return div("#app", [
        header,
        childDOM
    ]);
}

function intent(DOM) {
    const logoutAction$ = DOM
        .select(".logout")
        .events("click")
        .mapTo({ type: "logout" });

    return logoutAction$;
}

function view(user$, childDOM$) {
    return xs.combine(
            user$,
            childDOM$
        )
        .map(([user, childDOM]) => ({user, childDOM}))
        .map(render);
}

function App(sources) {
    const {DOM, api, props} = sources;
    const { Child, user$ } = props;

    const logoutAction$ = intent(DOM, api);

    const child = Child({ ...sources, props: { ...sources.props, user$: user$ }});

    return {
        ...child,
        DOM: view(user$, child.DOM),
        action$: logoutAction$
    }
}

export default App;
