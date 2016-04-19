import {Observable} from "rx";
import isolate from '@cycle/isolate';
import Timeline from "./Timeline/Timeline";
import assign from "object-assign";
import {div, ul} from "@cycle/dom";


function intent(token, api) {
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
            return div(user.pseudo)
        });
}

function App({DOM, api, token}) {

    const {token$, user$} = intent(token, api);

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
