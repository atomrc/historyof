import {Observable} from "rx";
import App from "./App";
import {div, form, input} from "@cycle/dom";
import assign from "object-assign";


function intent(DOM) {
    const login$ = DOM
        .select("input[name=login]")
        .events("keyup")
        .map(ev => ev.target.value);

    const password$ = DOM
        .select("input[name=password]")
        .events("keyup")
        .map(ev => ev.target.value);

    const loginValues$ = Observable.combineLatest(login$, password$, (login, password) => ({ login, password }))
    const loginRequest$ = DOM
        .select("form")
        .events("submit")
        .map(ev => { ev.preventDefault(); return ev; });

    return loginValues$.sample(loginRequest$);
}

function view(token$, user$) {
    return Observable
        .combineLatest(token$.startWith(null), user$.startWith(null), (token, user) => ({ token, user }))
        .map(({token, user}) => {
            if (!token) {
                return form([
                    input({type: "text", name: "login"}),
                    input({type: "password", name: "password"}),
                    input({type: "submit", name: "Go!"})
                ]);
            }
            if (!user) {
                return div("login in");
            }
            return div("ok app is on");
        });
}

function AuthContainer({DOM, api, storage}) {

    const loginRequest$ = intent(DOM)
        .map((loginValues) => assign({}, { type: "login" }, loginValues));

    const token$ = storage
        .local
        .getItem("token")
        .map(token => token);

    const user$ = api
        .filter(req => req.action.type === "fetchUser")
        .map(req => req.response);

    const vtree$ = view(token$, user$);

    const fetchUserRequest$ = token$
        .filter(token => !!token)
        .map(token => ({ type: "fetchUser", token: token }));

    return {
        DOM: vtree$,
        api: Observable.merge(fetchUserRequest$, loginRequest$),
        storage: api
            .filter(response => response.action.type === "login")
            .flatMap(response => response.response)
            .map(response => ({ key: "token", value: response.token }))
    }
}

export default AuthContainer;
