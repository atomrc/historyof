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

    return {
        initialToken$,
        fetchUserResponse$
    };
}

function model(initialToken$, loginToken$, loginUser$, fetchedUser$, logoutAction$) {
    const logoutData$ = logoutAction$.map(() => null);

    const user$ = Observable.merge(loginUser$, fetchedUser$);
    const token$ = Observable.merge(initialToken$, loginToken$, logoutData$);

    return {
        token$,
        user$
    };
}

function view(token$, loginForm$, app$) {
    return Observable
        .combineLatest(
            token$.startWith(null),
            loginForm$,
            app$.startWith(null),
            (token, loginForm, app) => ({ token, loginForm, app }))
        .map(({token, loginForm, app}) => {
            if (!token) {
                return loginForm;
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

    const { initialToken$, fetchUserResponse$ } = intent(api, storage);
    const { token$, user$ } = model(initialToken$, loginForm.token$, loginForm.user$, fetchUserResponse$, logoutActionProxy$);

    const fetchUserRequest$ = initialToken$
        .map(token => ({type: "fetchUser", token }));

    const logoutAction$ = app$.flatMap(app => app.logoutAction$);
    logoutAction$.subscribe(logoutActionProxy$);
    user$.subscribe(userProxy$);

    return {
        DOM: view(token$, loginForm.DOM, app$),
        api: Observable.merge(loginForm.api, fetchUserRequest$),
        storage: loginForm
            .token$
            .map(token => ({ key: "token", value: token }))
    }
}

export default AuthContainer;
