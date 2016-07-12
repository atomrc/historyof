import xs from "xstream";
import jwtDecode from "jwt-decode";


function model(storage, router) {
    const token$ = storage
        .local
        .getItem("token")

    const user$ = token$
        .filter(token => !!token)
        .map(jwtDecode)
        .startWith(null);

    const hashInfo$ = router
        .history$
        .map(({ hash }) => ({ hash, hasToken: hash.indexOf("id_token") > -1 }));

    return xs
        .combine(token$, user$, hashInfo$)
        .map(([ token, user, hashInfo ]) => ({ token, user, hashInfo }))
        .remember();
}

function wrap(Component) {
    return function protectedInstanciation(sources) {
        const { storage, router, auth0 } = sources;

        const state$ = model(storage, router);
        const user$ = state$
            .map(({ user }) => user)
            .filter(user => !!user);

        const sinks = Component(Object.assign({}, sources, { props: { user$: user$ }}));

        const tokenSaveRequest$ = auth0
            .filter(({ action }) => action.action === "parseHash")
            .map(({ response$ }) => response$)
            .flatten()
            .map(response => ({ key: "token", value: response }));

        const showLoginRequest$ = state$
            .filter(({ token, hashInfo }) => !token && !hashInfo.hasToken)
            .mapTo({ action: "show", params: {
                authParams: { scope: "openid nickname" },
                responseType: "token"
            }});

        const parseHashRequest$ = state$
            .filter(({ token, hashInfo }) => !token && hashInfo.hasToken)
            .map(({ hashInfo }) => ({ action: "parseHash", params: hashInfo.hash }));

        const tokenRemoveRequest$ = (sinks.action$ || xs.empty())
            .filter(action => action.type === "logout")
            .mapTo({ action: "removeItem", key: "token" })

        return Object.assign({}, sinks, {
            storage: xs.merge(
                tokenRemoveRequest$,
                tokenSaveRequest$,
                sinks.storage || xs.empty()
            ),

            auth0: xs.merge(showLoginRequest$, parseHashRequest$, sinks.auth0 || xs.empty()),
            //decorate all the component api requests with
            //the current token
            api: xs
                .combine(sinks.api, state$)
                .map(([apiRequest, state]) => Object.assign({}, apiRequest, { token: state.token }))
        });


    }
}
export default wrap;
