import xs from "xstream";
import {form, input, div} from "@cycle/dom";

function intent(DOM, api) {
    const login$ = DOM
        .select("input[name=login]")
        .events("change")
        .map(ev => ev.target.value);

    const password$ = DOM
        .select("input[name=password]")
        .events("change")
        .map(ev => ev.target.value);

    const loginValues$ = xs
        .combine((login, password) => ({ login, password }), login$, password$);

    const loginRequest$ = DOM
        .select("form")
        .events("submit")
        .map(ev => { ev.preventDefault(); return ev; });

    const loginResponse$ = api
        .filter(({ request }) => request.action === "login")
        .map(
            ({ response$ }) => response$.replaceError((error) => xs.of({error}))
        )
        .flatten()

    const loginSuccess$ = loginResponse$
        .filter((response) => !response.error);

    const loginError$ = loginResponse$
        .filter(response => response.error)
        .map(({error}) => error.error);

    return {
        loginRequest$: xs.combine((request, value) => value, loginRequest$, loginValues$), //FIXME
        loginSuccess$,
        loginError$
    };
}

function view(state$) {
    return state$
        .map(({error, isLoginIn}) => {
            var inputs = [
                input({ attrs: {type: "email", name: "login", required: "required" }}),
                input({ attrs: {type: "password", name: "password", required: "required" } }),
                input({ attrs: {type: "submit", value: isLoginIn ? "Login in" : "Go!" } })
            ]
            if (error) {
                inputs = [div(".error", error)].concat(inputs);
            }
            return div("#login-form", [form(inputs)]);
        })
}

function model(loginRequest$, loginSuccess$, loginError$) {
    const isLoginIn$ = xs.merge(
        loginRequest$.map(() => true),
        loginSuccess$.map(() => false),
        loginError$.map(() => false)
    );

    const state$ = xs.combine(
        (error, isLoginIn) => ({ error, isLoginIn }),
        loginError$.startWith(null),
        isLoginIn$.startWith(false)
    );

    return {
        loginData$: loginSuccess$,
        state$
    };
}

function LoginForm({DOM, api}) {
    const { loginRequest$, loginSuccess$, loginError$ } = intent(DOM, api);
    const { loginData$, state$ } = model(loginRequest$, loginSuccess$, loginError$);

    const apiLoginRequest$ = loginRequest$
        .map(loginValues => ({ action: "login", params: loginValues}))

    return {
        DOM: view(state$),
        api: apiLoginRequest$,
        loginData$
    }
}

export default LoginForm;
