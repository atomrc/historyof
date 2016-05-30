import xs from "xstream";
import {div} from "@cycle/dom";
import App from "./App";

function intent(DOM, api, app) {
    const logoutAction$ = app.logoutAction$

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
        fetchUserError$
    };
}

function UserContainer({DOM, api, props}) {
    const { buildComponent, token$ } = props;

    const userProxy$ = xs.createWithMemory();

    const app = buildComponent(App, { DOM, api, props: { user$: userProxy$ }}, "app")

    const {
            logoutAction$,
            fetchUserSuccess$,
            fetchUserError$
        } = intent(DOM, api, app);

    const user$ = fetchUserSuccess$;

    const fetchUserReques$ = token$
        .filter(token => !!token)
        .mapTo({ action: "fetchUser" });

    userProxy$.imitate(user$);

    return {
        DOM: app.DOM,
        api: xs.merge(fetchUserReques$, app.api),
        logoutAction$,
        tokenError$: fetchUserError$
    }
}

export default UserContainer;
