import {Observable} from "rx";
import {form, input, div} from "@cycle/dom";
import assign from "object-assign";

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
        .filter(req => req.action.type === "login")
        .flatMap(req => {
            return req
                .response$
                .catch((error) => Observable.just({error}));
        });

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
    const user$ = loginSuccess$
        .map(res => res.user);

    const token$ = loginSuccess$
        .map(res => res.token);

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
        user$,
        token$,
        state$
    };
}

function LoginForm({DOM, api}) {
    const { formIsValid$, loginRequest$, loginSuccess$, loginError$ } = intent(DOM, api);
    const { user$, token$, state$ } = model(loginRequest$, loginSuccess$, loginError$, formIsValid$);


    const apiLoginRequest$ = loginRequest$
        .map(loginValues => assign({}, { type: "login" }, loginValues));

    return {
        DOM: view(state$),
        api: apiLoginRequest$,
        user$,
        token$
    }
}

export default LoginForm;
