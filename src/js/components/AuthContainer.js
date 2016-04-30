import {Observable} from "rx";
import LoginForm from "./LoginForm";
import assign from "object-assign";
import {div} from "@cycle/dom";

function intent(api, storage, app$) {
    const initialToken$ = storage
        .local
        .getItem("token");

    const fetchUserResponse$ = api
        .filter(res => res.action.type === "fetchUser")
        .flatMap(req => {
            return req
                .response$
                .catch((error) => Observable.just({error}));
        });

    const fetchUserSuccess$ = fetchUserResponse$
        .filter(response => !response.error);

    const fetchUserError$ = fetchUserResponse$
        .filter((response) => response.error)
        .map(response => response.error.error);

    return {
        initialToken$,
        fetchUserSuccess$,
        fetchUserError$,
        logoutAction$: app$.flatMap(app => app.logoutAction$),
        appApiRequest$: app$.flatMap(app => app.api)
    };
}

function model(initialToken$, loginToken$, loginUser$, fetchedUser$, logoutAction$, fetchUserError$) {
    const logoutData$ = Observable.merge(logoutAction$, fetchUserError$).map(() => null);

    const user$ = Observable.merge(loginUser$, fetchedUser$);
    const token$ = Observable.merge(initialToken$, loginToken$, logoutData$);

    return {
        token$,
        user$,
        error$: fetchUserError$
    };
}

function view(token$, loginForm$, app$, error$) {
    return Observable
        .combineLatest(
            token$,
            loginForm$,
            app$.startWith(null),
            error$.startWith(null),
            (token, loginForm, app, error) => ({ token, loginForm, app, error }))
        .map(({token, loginForm, app, error}) => {
            if (!token) {
                const children = error ? [div(".error", error), loginForm] : loginForm;
                return div(children);
            }
            if (app) {
                return app.DOM;
            }
            return div("login in");
        });
}

function AuthContainer({DOM, api, storage, app$}) {

    const loginForm = LoginForm({ DOM, api });

    const {
        initialToken$,
        fetchUserSuccess$,
        fetchUserError$,
        logoutAction$,
        appApiRequest$
    } = intent(api, storage, app$);

    const { token$, user$, error$ } = model(
        initialToken$,
        loginForm.token$,
        loginForm.user$,
        fetchUserSuccess$,
        logoutAction$,
        fetchUserError$
    );

    const fetchUserRequest$ = initialToken$
        .filter(token => !!token)
        .map(token => ({type: "fetchUser", token }));

    const tokenSave$ = loginForm
        .token$
        .map(token => ({ key: "token", value: token }));

    const tokenRemove$ = Observable.merge(logoutAction$, fetchUserError$)
        .map(() => ({ action: "removeItem", key: "token" }));

    const protectedApiRequest$ = appApiRequest$
        .withLatestFrom(
            token$,
            (request, token) => assign({}, request, { token: token })
        );

    const tokenStorageRequest$ = Observable.merge(tokenRemove$, tokenSave$);

    return {
        DOM: view(token$, loginForm.DOM, app$, error$),
        api: Observable.merge(loginForm.api, fetchUserRequest$, protectedApiRequest$),
        storage: tokenStorageRequest$,
        user$: user$
    }
}

export default AuthContainer;
