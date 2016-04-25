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

function view(user$) {
    return user$
        .map(user => {
            return div([
                user.pseudo,
                button(".logout", "Logout")
            ]);
        });
}

function App({DOM, api, user$}) {
    const logoutAction$ = intent(DOM);

    const vtree$ = view(user$);

    return {
        DOM: vtree$,
        api: Observable.empty(),
        logoutAction$
    }
}

export default App;
