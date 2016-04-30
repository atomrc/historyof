import {Observable} from "rx";
import {div, button} from "@cycle/dom";


function intent(DOM, api) {
    const logoutAction$ = DOM
        .select(".logout")
        .events("click")
        .map({ type: "logout" });


    const storiesResponse$ = api
        .filter(req => req.action.type === "fetchStories")
        .flatMap(({ response$ }) => {
            return response$
                .catch(error => Observable.just({ error }));
        });

    return {
        logoutAction$,
        storiesResponse$
    };
}

function view(user$, stories$) {
    return Observable.combineLatest(
            user$,
            stories$.startWith(null),
            (user, stories) => ({user, stories})
        )
        .map(({user, stories}) => div([
            user.pseudo,
            button(".logout", "Logout"),
            (stories ? stories.length : "loading")
        ]));
}

function App({DOM, api, user$}) {
    const { logoutAction$, storiesResponse$ } = intent(DOM, api);

    const apiRequest$ = Observable.just({ type: "fetchStories" });

    return {
        DOM: view(user$, storiesResponse$),
        api: apiRequest$,
        logoutAction$
    }
}

export default App;
