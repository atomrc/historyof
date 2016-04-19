import {Observable} from "rx";
//import isolate from '@cycle/isolate';
//import Timeline from "./Timeline/Timeline";
//import assign from "object-assign";
import {div, button} from "@cycle/dom";


function intent(DOM) {
    const logoutAction$ = DOM
        .select(".logout")
        .events("click")
        .map({ type: "logout" });

    return logoutAction$;
}

function model(token, api, logoutAction$) {
    const token$ = token ?
        Observable.just(token) :
        api
            .filter((req) => req.action.type === "login" || req.action.type === "fetchUser")
            .map(({ token }) => token);

    const user$ = api
        .filter((req) => req.action.type === "login" || req.action.type === "fetchUser")
        .flatMap(({ response }) => response)
        .map(response => response.user ? response.user : response);

    return { token$, user$ };
}

function view(token$, user$) {
    return Observable
        .combineLatest(
            token$.startWith(null),
            user$.startWith(null),
            (token, user) => ({ token: token, user: user }))
        .map(({ token, user }) => {
            if (!token) {
                return div("unlogged");
            }
            if (token && !user) {
                return div("login in");
            }
            return div([
                user.pseudo,
                button(".logout", "Logout")
            ])
        });
}

function App({DOM, api, token}) {

    const logoutAction$ = intent(DOM);
    const {token$, user$} = model(token, api, logoutAction$);

    const vtree$ = view(token$, user$);

    const fetchUserRequest$ = Observable
        .combineLatest(token$, user$.isEmpty(), (token, userIsEmpty) => ({ token, userIsEmpty }))
        .filter(({ userIsEmpty }) => userIsEmpty)
        .map(({ token }) => ({ type: "fetchUser", token: token }));

    return {
        DOM: vtree$,
        api: fetchUserRequest$
    }
}

export default App;
