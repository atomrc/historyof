import xs from "xstream";
import {div, button, span} from "@cycle/dom";
import assign from "object-assign";

function render(user) {
    const header = user ?
        div("#app-header", [
            span(".pseudo", user.pseudo),
            button(".logout", "Logout")
        ]) :
        div(".loading", "loading...");

    return div("#app", [
        header
    ]);
}

function intent(DOM, api) {
    const logoutAction$ = DOM
        .select(".logout")
        .events("click")
        .mapTo({ type: "logout" });

    const storiesResponse$ = api
        .filter(({ request }) => request.action === "fetchStories")
        .map(({ response$ }) => {
            return response$
                .replaceError(error => xs.of({ error }));
        })
        .flatten()
        .remember()

    const fetchUserResponse$ = api
        .filter(({ request }) => request.action === "fetchUser")
        .map(({ response$ }) => {
            return response$
                .replaceError(error => xs.of({ error }));
        })
        .flatten()
        .remember()

    const fetchUserSuccess$ = fetchUserResponse$
        .filter(response => !response.error);

    const fetchUserError$ = fetchUserResponse$
        .filter(response => response.error)
        .map(response => response.error);

    return {
        logoutAction$,
        fetchUserSuccess$,
        fetchUserError$,
        stories$: storiesResponse$.filter(res => !res.error)
    };
}

function view(user$) {
    return user$
        .startWith(null)
        .map(render);
}

function App({DOM, api, token$}) {
    const {
            logoutAction$,
            fetchUserSuccess$,
            fetchUserError$
        } = intent(DOM, api);

    const user$ = fetchUserSuccess$;

    const fetchUserRequest$ = xs.of({ action: "fetchUser" });
    const apiRequest$ = xs
        .merge(fetchUserRequest$)
        .combine((req, token) => assign({}, req, { token }), token$);

    return {
        DOM: view(user$),
        api: apiRequest$,
        logoutAction$,
        tokenError$: fetchUserError$
    }
}

export default App;
