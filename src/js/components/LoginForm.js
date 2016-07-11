import xs from "xstream";
import {div} from "@cycle/dom";

function model(storage, router) {
    const token$ = storage
        .local
        .getItem("token");

    const accessTokenHash$ = router
        .history$
        .map(({ hash }) => ({ hash, isPresent: hash.indexOf("id_token") > -1 }));

    return xs
        .combine(token$, accessTokenHash$)
        .map(([token, accessTokenHash]) => ({ token, accessTokenHash }))
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

    const showLoginRequest$ = state$
        .filter(({ token, accessTokenHash }) => !token && !accessTokenHash.isPresent)
        .mapTo({ action: "show", params: {
            authParams: { scope: "openid nickname" },
            responseType: "token"
        }});

    const parseHashRequest$ = state$
        .filter(({ token, accessTokenHash }) => !token && accessTokenHash.isPresent)
        .map(({ accessTokenHash }) => ({ action: "parseHash", params: accessTokenHash.hash }));

    const appRedirect$ = state$
        .filter(({ token }) => !!token)
        .mapTo("/me");

    return {
        DOM: xs.of(div("#login")),
        storage: tokenSaveRequest$,
        router: appRedirect$,
        auth0: xs.merge(showLoginRequest$, parseHashRequest$)
    }
}

export default LoginForm;
