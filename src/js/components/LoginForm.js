import {Observable} from "rx";
import {form, input, div} from "@cycle/dom";

function intent(DOM, api) {
    const form = DOM.select("form");
    const formIsValid$ = Observable.merge(
            form.events("change"),
            form.events("keyup")
        )
        .map(ev => ev.currentTarget)
        .map(form => form.checkValidity ? form.checkValidity() : true);

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
        .filter(({ request }) => request.action === "login")
        .flatMap(({ response$ }) =>
             response$.catch((error) => Observable.just({error}))
        );

    const loginSuccess$ = loginResponse$
        .filter((response) => !response.error);

    const loginError$ = loginResponse$
        .filter(response => response.error)
        .map(({error}) => error.error);

    return {
        formIsValid$,
        loginRequest$: loginValues$.sample(loginRequest$),
        loginSuccess$,
        loginError$
    };
}

function view(state$) {
    return state$
        .map(({error, formValid, isLoginIn}) => {
            var inputs = [
                input({type: "email", name: "login", required: "required" }),
                input({type: "password", name: "password", required: "required" }),
                input({type: "submit", value: isLoginIn ? "Login in" : "Go!", disabled: !formValid || isLoginIn })
            ]
            if (error) {
                inputs = [div(".error", error)].concat(inputs);
            }
            return form("#login-form", inputs);
        })
}

function model(loginRequest$, loginSuccess$, loginError$, formIsValid$) {
    const isLoginIn$ = Observable.merge(
        loginRequest$.map(() => true),
        loginSuccess$.map(() => false),
        loginError$.map(() => false)
    );


    const state$ = Observable.combineLatest(
        loginError$.startWith(null),
        formIsValid$.startWith(false),
        isLoginIn$.startWith(false),
        (error, formValid, isLoginIn) => ({ error, formValid, isLoginIn })
    );

    return {
        loginData$: loginSuccess$,
        state$
    };
}

function LoginForm({DOM, api}) {
    const { formIsValid$, loginRequest$, loginSuccess$, loginError$ } = intent(DOM, api);
    const { loginData$, state$ } = model(loginRequest$, loginSuccess$, loginError$, formIsValid$);

    const apiLoginRequest$ = loginRequest$
        .map(loginValues => ({ action: "login", params:  loginValues}));

    return {
        DOM: view(state$),
        api: apiLoginRequest$,
        loginData$
    }
}

export default LoginForm;
