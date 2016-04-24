import {Observable, Subject} from "rx";
import App from "./App";
import {div, form, input} from "@cycle/dom";
import assign from "object-assign";

function intent(DOM, api, storage) {
    const sourceToken$ = storage
            .local
            .getItem("token")
            .filter(token => !!token);

    const login$ = DOM
        .select("input[name=login]")
        .events("keyup")
        .map(ev => ev.target.value);

    const password$ = DOM
        .select("input[name=password]")
        .events("keyup")
        .map(ev => ev.target.value);

    const loginValues$ = Observable
        .combineLatest(login$, password$, (login, password) => ({ login, password }))

    const loginRequest$ = DOM
        .select("form")
        .events("submit")
        .map(ev => { ev.preventDefault(); return ev; });

    const loginResponse$ = api
        .filter(req => req.action.type === "login")
        .flatMap(req => req.response);

    const fetchUserResponse$ = api
        .filter(res => res.action.type === "fetchUser")
        .flatMap(req => req.response);

    const fetchUserRequest$ = sourceToken$
        .map(token => ({ type: "fetchUser", token }))

    return {
        sourceToken$,
        loginAction$: loginValues$.sample(loginRequest$),
        loginResponse$,
        fetchUserResponse$,
        fetchUserRequest$
    };
}

function model(tokenResponse$, loginResponse$, fetchUserResponse$) {
    const userLogin$ = loginResponse$
        .map(res => res.user);

    const user$ = Observable.merge(fetchUserResponse$, userLogin$);

    return {
        token$: tokenResponse$,
        user$
    };
}

function view(token$, app$) {
    return Observable
        .combineLatest(token$.startWith(null), app$.startWith(null), (token, app) => ({ token, app }))
        .map(({token, app}) => {
            if (!token) {
                return form([
                    input({type: "text", name: "login"}),
                    input({type: "password", name: "password"}),
                    input({type: "submit", name: "Go!"})
                ]);
            }
            if (!app) {
                return div("login in");
            }
            return div({ id: "app" }, app.DOM);
        });
}

function AuthContainer({DOM, api, storage}) {

    //const logoutActionProxy = Subject();

    const { sourceToken$, loginAction$, loginResponse$, fetchUserRequest$, fetchUserResponse$ } = intent(DOM, api, storage);
    const { token$, user$ } = model(sourceToken$, loginResponse$, fetchUserResponse$);

    const app$ = user$
        .map(user => App({ DOM, api, user }));

    const loginRequest$ = loginAction$
        .map((loginValues) => assign({}, { type: "login" }, loginValues));

    return {
        DOM: view(token$, app$),
        api: Observable.merge(fetchUserRequest$, loginRequest$),
        storage: loginResponse$
            .map(res => res.token)
            .map(token => ({ key: "token", value: token }))
    }
}

export default AuthContainer;
