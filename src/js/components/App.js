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
        .combineLatest(token$.startWith(null), user$.startWith(null), (token, user) => ({ token: token, user: user }))
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

    /*
    const token$ = api
        .find(req => req.action.type === "login")
        .flatMap(({response}) => response);

    const stories$ = api
        //get a single element (get a completed stream)
        .find(request => request.action.type === "fetchStories")
        .map(({ response }) => response);

       */

    const fetchUserRequest$ = token$
        .map(token => ({ type: "fetchUser", token: token }));

    return {
        DOM: vtree$,
        api: fetchUserRequest$
        /*
        api: timeline
            .action$
            .startWith({ type: "login", login: "felix@felix.fr", password: "felix" })
            .map((action) =>
                //décorate the action that is given to the api
                //with the user's token that authenticate him against the
                //server
                assign({}, action, { token: token })
            )
            */
    }
}

export default App;
