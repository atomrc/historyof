import xs from "xstream";
import {div} from "@cycle/dom";
import jwtDecode from "jwt-decode";

function model(auth0, router) {
    const token$ = auth0.token$;

    const user$ = token$
        .map(token => token ? jwtDecode(token) : null);

    const location$ = router
        .history$
        .map(location => ({ ...location, hasToken: location.hash.indexOf("id_token") > -1 }))

    return {
        user$: user$.remember(),
        state$: xs
            .combine(token$, location$)
            .map(([ token, location ]) => ({ token, location }))
            .remember()
    };
}

function render(user$, componentDOM) {
    return user$
        .map(user => {
            return user ?
                componentDOM :
                xs.of(div(".unlogged"))
        })
        .flatten();
}

/**
 * Responsible for wrapping a generic component with an authentication layer
 * Will also decorate all api call of the child component with the user's token
 *
 * @param {Object} sources sources (that will also be used by the child component)
 * @returns {Object} sinks
 */
function AuthenticationWrapper(sources) {
    const { router, auth0, api } = sources;
    const { Child } = sources.props;

    const invalidToken$ = api
        .map(({ response$ }) => response$)
        .flatten()
        .replaceError(error => xs.of(error))
        .filter(response => response.status === 401)

    const { user$, state$ } = model(auth0, router);
    const loggedUser$ = user$.filter(user => !!user).remember();

    const childSources = { ...sources, props: { ...sources.props, user$: loggedUser$ }};
    const sinks = Child(childSources);

    const showLoginRequest$ = state$
        .filter(({ token, location }) => !token && !location.hasToken)
        .mapTo({
            action: "show",
            params: {
                authParams: { scope: "openid nickname" },
                responseType: "token"
            }
        });

    const parseHashRequest$ = state$
        .filter(({ token, location }) => !token && location.hasToken)
        .map(({ location }) => ({ action: "parseHash", params: location.hash }));

    const logoutAction$ = (sinks.action$ || xs.empty())
        .filter(action => action.type === "logout")

    const logout$ = xs.merge(logoutAction$, invalidToken$)
        .mapTo({ action: "logout" })

    const cleanHash$ = state$
        .filter(state => state.location.hasToken && state.token)
        .map(state => state.location.pathname)

    return Object.assign({}, sinks, {
        DOM: render(user$, sinks.DOM),

        router: xs.merge(cleanHash$, sinks.router || xs.empty()),

        auth0: xs.merge(showLoginRequest$, parseHashRequest$, logout$, sinks.auth0 || xs.empty()),
        //decorate all the component api requests with
        //the current token
        api: sinks
            .api
            .map(request => state$.filter(state => state.token).map(state => ({ ...request, token: state.token })).take(1))
            .flatten()
    });
}

export default AuthenticationWrapper;
