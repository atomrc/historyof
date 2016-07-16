import xs from "xstream";
import {div} from "@cycle/dom";
import jwtDecode from "jwt-decode";

function model(storage, router) {
    const token$ = storage
        .local
        .getItem("token")

    const user$ = token$
        .map(token => token ? jwtDecode(token) : null);

    const hasHashToken$ = router
        .history$
        .map(location => location.hash.indexOf("id_token") > -1);

    return {
        user$: user$.remember(),
        state$: xs
            .combine(token$, router.history$, hasHashToken$)
            .map(([ token, location, hasHashToken ]) => ({ token, location, hasHashToken }))
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
    const { storage, router, auth0 } = sources;
    const { Child } = sources.props;

    const { user$, state$ } = model(storage, router);
    const loggedUser$ = user$.filter(user => !!user).remember();

    const childSourcesProps = { ...sources.props, user$: loggedUser$ };
    const childSources = { ...sources, props: childSourcesProps};
    const sinks = Child(childSources);

    const tokenSaveRequest$ = auth0
        .filter(({ action }) => action.action === "parseHash")
        .map(({ response$ }) => response$)
        .flatten()
        .map(response => ({ key: "token", value: response }));

    const showLoginRequest$ = state$
        .filter(({ token, hasHashToken }) => !token && !hasHashToken)
        .mapTo({ action: "show", params: {
            authParams: { scope: "openid nickname" },
            responseType: "token"
        }});

    const parseHashRequest$ = state$
        .filter(({ token, hasHashToken }) => !token && hasHashToken)
        .map(({ location }) => ({ action: "parseHash", params: location.hash }));

    const tokenRemoveRequest$ = (sinks.action$ || xs.empty())
        .filter(action => action.type === "logout")
        .mapTo({ action: "removeItem", key: "token" })

    const cleanHash$ = xs
        .combine(state$, loggedUser$)
        .map(([ state ]) => ({ location: state.location, hasHashToken: state.hasHashToken }))
        .filter(({ hasHashToken }) => hasHashToken)
        .map(({ location }) => location.pathname);

    return Object.assign({}, sinks, {
        DOM: render(user$, sinks.DOM),

        storage: xs.merge(
            tokenRemoveRequest$,
            tokenSaveRequest$,
            sinks.storage || xs.empty()
        ),

        router: xs.merge(cleanHash$, sinks.router || xs.empty()),

        auth0: xs.merge(showLoginRequest$, parseHashRequest$, sinks.auth0 || xs.empty()),
        //decorate all the component api requests with
        //the current token
        api: xs
            .combine(sinks.api, state$)
            .map(([apiRequest, state]) => Object.assign({}, apiRequest, { token: state.token }))
    });
}

export default AuthenticationWrapper;
