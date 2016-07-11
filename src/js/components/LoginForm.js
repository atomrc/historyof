import xs from "xstream";

function model(storage, router) {
    const token$ = storage
        .local
        .getItem("token");

    const hasAccessTokenHash$ = router
        .history$
        .map(({ hash }) => hash.indexOf("access_token") > -1);

    return xs
        .combine(token$, hasAccessTokenHash$)
        .map(([token, hasAccessTokenHash]) => ({ token, hasAccessTokenHash }))
        .remember();
}

function LoginForm({storage, auth0, router}) {

    const state$ = model(storage, router);

    const tokenError$ = xs.empty(); //TODO

    const tokenSaveRequest$ = auth0
        .filter(({ action }) => action.action === "parseHash")
        .map(({ response$ }) => response$)
        .flatten()
        .map(response => ({ key: "token", value: response }));
        //app
        //.error$
        //.filter(error => error.type === "tokenError");

    const showLoginRequest$ = state$
        .filter(({ token, hasAccessTokenHash }) => !token && !hasAccessTokenHash)
        .mapTo({ action: "show" });

    const parseHashRequest$ = state$
        .filter(({ token, hasAccessTokenHash }) => !token && hasAccessTokenHash)
        .map(({ locationHash }) => ({ action: "parseHash", params: locationHash }));

    const appRedirect$ = state$
        .filter(({ token }) => !!token)
        .mapTo("/me");

    return {
        storage: tokenSaveRequest$,
        router: appRedirect$,
        auth0: xs.merge(showLoginRequest$, parseHashRequest$)
    }
}

export default LoginForm;
