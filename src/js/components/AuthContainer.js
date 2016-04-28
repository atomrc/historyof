import {Observable} from "rx";
import LoginForm from "./LoginForm";
import assign from "object-assign";
import {div} from "@cycle/dom";

function intent(api, storage, app$) {
    const initialToken$ = storage
        .local
        .getItem("token")
        .filter(token => !!token);

    const fetchUserResponse$ = api
        .filter(res => res.action.type === "fetchUser")
        .flatMap(req => req.response);

    const fetchUserError$ = fetchUserResponse$
        .filter(() => false)
        .catch(error => Observable.just(error));

    return {
        initialToken$,
        fetchUserResponse$: fetchUserResponse$
            .catch(() => Observable.empty()),
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
            token$.startWith(null),
            loginForm$,
            app$.startWith(null),
            error$.startWith(null),
            (token, loginForm, app, error) => ({ token, loginForm, app, error }))
        .map(({token, loginForm, app, error}) => {
            if (!token) {
                const children = error ? [div(".error", error.error), loginForm] : loginForm;
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
        fetchUserResponse$,
        fetchUserError$,
        logoutAction$,
        appApiRequest$
    } = intent(api, storage, app$);

    const { token$, user$, error$ } = model(
        initialToken$,
        loginForm.token$,
        loginForm.user$,
        fetchUserResponse$,
        logoutAction$,
        fetchUserError$
    );

    const fetchUserRequest$ = initialToken$
        .map(token => ({type: "fetchUser", token }));

    const tokenSave$ = loginForm
        .token$
        .map(token => ({ key: "token", value: token }))

    const tokenRemove$ = logoutAction$
        .map(() => ({ type: "remove", key: "token" }));

    const protectedApiRequest$ = appApiRequest$
        .withLatestFrom(
            token$,
            (request, token) => assign({}, request, { token: token })
        );

    return {
        DOM: view(token$, loginForm.DOM, app$, error$),
        api: Observable.merge(loginForm.api, fetchUserRequest$, protectedApiRequest$),
        storage: Observable.merge(tokenSave$, tokenRemove$),
        user$: user$
    }
}

export default AuthContainer;
