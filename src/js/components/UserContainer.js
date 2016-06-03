import xs from "xstream";
import App from "./App";

function intent(DOM, api, appAction$) {
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
        logoutAction$: appAction$.filter(action => action.type === "logout"),
        fetchUserSuccess$,
        fetchUserError$
    };
}

function UserContainer({DOM, api, props}) {
    const { buildComponent, token$ } = props;

    const appActionProxy$ = xs.createMimic();

    const {
            logoutAction$,
            fetchUserSuccess$,
            fetchUserError$
        } = intent(DOM, api, appActionProxy$);

    const user$ = fetchUserSuccess$;

    const app = buildComponent(App, { DOM, api, props: { user$ }}, "app")


    const fetchUserReques$ = token$
        .filter(token => !!token)
        .mapTo({ action: "fetchUser" });

    appActionProxy$.imitate(app.action$);

    return {
        DOM: app.DOM,
        api: xs.merge(fetchUserReques$, app.api),
        action$: logoutAction$,
        tokenError$: fetchUserError$
    }
}

export default UserContainer;
