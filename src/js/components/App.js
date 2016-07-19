import xs from "xstream";
import {div, button, span} from "@cycle/dom";

function render({user, childDOM}) {
    if (!user) {
        return div("loading...");
    }
    const header = div("#app-header", [
        span(".pseudo", user.nickname),
        button(".logout", "Logout")
    ]);

    return div("#app", [
        header,
        childDOM
    ]);
}

function intent(DOM, api) {
    const logoutAction$ = DOM
        .select(".logout")
        .events("click")
        .mapTo({ type: "logout" });

    const apiUnauthorized$ = api
        .error$
        .filter(({ error }) => error.status === 401);

    return xs.merge(logoutAction$, apiUnauthorized$);
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
        auth0: logoutAction$
            .mapTo({ action: "logout" })
    }
}

export default App;
