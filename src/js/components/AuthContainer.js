import {Observable, ReplaySubject, Subject} from "rx";
import LoginForm from "./LoginForm";
import App from "./App";
import {div} from "@cycle/dom";

function intent(api, storage) {
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
        fetchUserError$
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
                return div({ id: "app" }, app.DOM);
            }
            return div("login in");
        });
}

function AuthContainer({DOM, api, storage}) {

    const logoutActionProxy$ = new Subject();
    const userProxy$ = new ReplaySubject();

    const loginForm = LoginForm({ DOM, api });
    const app$ = userProxy$.map(user => App({ DOM, api, user$: Observable.just(user) }));

    const { initialToken$, fetchUserResponse$, fetchUserError$ } = intent(api, storage);
    const { token$, user$, error$ } = model(initialToken$, loginForm.token$, loginForm.user$, fetchUserResponse$, logoutActionProxy$, fetchUserError$);

    const fetchUserRequest$ = initialToken$
        .map(token => ({type: "fetchUser", token }));

    const logoutAction$ = app$.flatMap(app => app.logoutAction$);
    logoutAction$.subscribe(logoutActionProxy$);
    user$.subscribe(userProxy$);

    return {
        DOM: view(token$, loginForm.DOM, app$, error$),
        api: Observable.merge(loginForm.api, fetchUserRequest$),
        storage: loginForm
            .token$
            .map(token => ({ key: "token", value: token }))
    }
}

export default AuthContainer;
