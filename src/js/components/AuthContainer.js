import xs from "xstream";
import App from "./App";


function model(storage, auth0) {
    const token$ = storage
        .local
        .getItem("token");

    const user$ = auth0
        .filter(({ action }) => action.action === "getProfile")
        .map(({ response$ }) => response$)
        .flatten();

    return xs
        .combine(token$, user$.startWith(null))
        .map(([ token, user ]) => ({ token, user, locationHash: window.location.hash }))
        .remember();
}
/**
 * is responsible for the logged part of the app.
 * Depending on the token it gets from the local storage
 * it will display the login form or the app
 *
 * @param {DOMSource} DOM the DOM source
 * @param {apiSource} api the api source
 * @param {storageSource} storage the storage source
 * @returns {object} streams
 */
function AuthContainer({DOM, api, storage, auth0, props}) {

    const {buildComponent} = props;

    const state$ = model(storage, auth0);

    const app = buildComponent(App, { DOM, api, props: { user$: state$.map(state => state.user).filter(user => !!user) } }, "app")

    const apiRequest$ = xs
        .combine(app.api, state$.map(state => state.token))
        .map(([request, token]) => Object.assign({}, request, { token }));

    const logoutAction$ = app
        .action$
        .filter(action => action.type === "logout")

    const tokenError$ = xs.empty();

    const tokenSaveRequest$ = auth0
        .filter(({ action }) => action.action === "parseHash")
        .map(({ response$ }) => response$)
        .flatten()
        .map(response => ({ key: "token", value: response }));
        //app
        //.error$
        //.filter(error => error.type === "tokenError");

    const tokenRemoveRequest$ = xs
        .merge(logoutAction$, tokenError$)
        .mapTo({ action: "removeItem", key: "token" });

    const showLoginRequest$ = state$
        .filter(({ token, locationHash }) => !token && locationHash.length <= 1)
        .mapTo({ action: "show" });

    const parseHashRequest$ = state$
        .filter(({ token, locationHash }) => !token && locationHash.length >= 1)
        .map(({ locationHash }) => ({ action: "parseHash", params: locationHash }));

    const getProfileRequest$ = state$
        .filter(({ token, user }) => !!token && !user)
        .map(({ token }) => ({ action: "getProfile", params: token }))

    return {
        DOM: app.DOM,
        api: apiRequest$,
        storage: xs.merge(tokenRemoveRequest$, tokenSaveRequest$),
        error$: tokenError$,
        auth0: xs.merge(showLoginRequest$, parseHashRequest$, getProfileRequest$)
    }
}

export default AuthContainer;
