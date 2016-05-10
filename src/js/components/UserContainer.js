import {Observable} from "rx";
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
        .map({ type: "logout" });

    const storiesResponse$ = api
        .filter(({ request }) => request.action === "fetchStories")
        .flatMap(({ response$ }) => {
            return response$
                .catch(error => Observable.just({ error }));
        })
        .shareReplay(1);

    const fetchUserResponse$ = api
        .filter(({ request }) => request.action === "fetchUser")
        .flatMapLatest(({ response$ }) => {
            return response$
                .catch(error => Observable.just({ error }));
        })
        .shareReplay(1);

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

    const fetchUserRequest$ = Observable.just({ action: "fetchUser" });
    const apiRequest$ = Observable
        .merge(fetchUserRequest$)
        .withLatestFrom(token$, (req, token) => assign({}, req, { token }));

    return {
        DOM: view(user$),
        api: apiRequest$,
        logoutAction$,
        tokenError$: fetchUserError$
    }
}

export default App;
