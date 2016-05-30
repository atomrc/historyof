import xs from "xstream";
import {div} from "@cycle/dom";
import App from "./App";

function render(appDOM) {
   return appDOM ?
        appDOM :
        div(".loading", "loading...");
}

function intent(DOM, api, app$) {
    const logoutAction$ = app$
        .map(app => app.logoutAction$)
        .flatten()

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

function view(appDOM$) {
    return appDOM$
        .startWith(null)
        .map(render);
}

function UserContainer({DOM, api, props}) {
    const { buildComponent } = props;

    const userProxy$ = xs.createWithMemory();

    const app$ = userProxy$
        .map(user => buildComponent(App, { DOM, api, props: { user$: xs.of(user) }}, "app"))
        .remember();

    const {
            logoutAction$,
            fetchUserSuccess$,
            fetchUserError$
        } = intent(DOM, api, app$);

    const user$ = fetchUserSuccess$;

    const fetchUserReques$ = xs.of({ action: "fetchUser" });
    const appApiRequest$ = app$.map(app => app.api).flatten();

    userProxy$.imitate(user$);

    return {
        DOM: view(app$.map(app => app.DOM).flatten()),
        api: xs.merge(fetchUserReques$, appApiRequest$),
        logoutAction$,
        tokenError$: fetchUserError$
    }
}

export default UserContainer;
