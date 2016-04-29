import {Observable} from "rx";
import {form, input, div} from "@cycle/dom";
import assign from "object-assign";

function intent(DOM, api) {
    const login$ = DOM
        .select("input[name=login]")
        .events("change")
        .map(ev => ev.target.value);

    const password$ = DOM
        .select("input[name=password]")
        .events("change")
        .map(ev => ev.target.value);

    const loginValues$ = Observable
        .combineLatest(login$, password$, (login, password) => ({ login, password }));

    const loginRequest$ = DOM
        .select("form")
        .events("submit")
        .map(ev => { ev.preventDefault(); return ev; });

    const loginResponse$ = api
        .filter(req => req.action.type === "login")
        .flatMap(req => req.response$)
        .catch((error) => Observable.just(error));

    const loginSuccess$ = loginResponse$
        .filter((response) => !response.error);

    const loginError$ = loginResponse$
        .filter(response => response.error)
        .map(error => error.error);

    return {
        loginRequest$: loginValues$.sample(loginRequest$),
        loginSuccess$,
        loginError$
    };
}

function view(loginError$) {
    return loginError$
        .startWith(null)
        .map(error => {
            var inputs = [
                input({type: "text", name: "login"}),
                input({type: "password", name: "password"}),
                input({type: "submit", name: "Go!"})
            ]
            if (error) {
                inputs = [div(".error", error)].concat(inputs);
            }
            return form(inputs);
        })
}

function LoginForm({DOM, api}) {
    const { loginRequest$, loginSuccess$, loginError$ } = intent(DOM, api);

    const user$ = loginSuccess$
        .map(res => res.user);

    const token$ = loginSuccess$
        .map(res => res.token);

    const apiLoginRequest$ = loginRequest$
        .map(loginValues => assign({}, { type: "login" }, loginValues));

    return {
        DOM: view(loginError$),
        api: apiLoginRequest$,
        user$,
        token$
    }
}

export default LoginForm;
