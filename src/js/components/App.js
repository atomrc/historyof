import {Observable} from "rx";
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
        .map(user => div([
            user.pseudo,
            button(".logout", "Logout")
        ]));
}

function App({DOM, api, user$}) {
    const logoutAction$ = intent(DOM);

    return {
        DOM: view(user$),
        api: Observable.empty(),
        logoutAction$
    }
}

export default App;
