import {Observable, ReplaySubject} from "rx";
import {div, button, span} from "@cycle/dom";
import Timeline from "./Timeline/Timeline";

function render({user, timeline}) {
    const header = div("#app-header", [
        span(".pseudo", user.pseudo),
        button(".logout", "Logout")
    ]);

    return div("#app", [
        header,
        (timeline ? timeline : "loading")
    ]);
}

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
        stories$: storiesResponse$.filter(res => !res.error)
    };
}

function view(user$, timeline$) {
    return Observable.combineLatest(
            user$,
            timeline$.startWith(null),
            (user, timeline) => ({user, timeline})
        )
        .map(render);
}

function App({DOM, api, user$}) {
    const storiesProxy$ = new ReplaySubject();
    const timeline$ = storiesProxy$.map(stories => Timeline({ DOM, api, stories$: Observable.just(stories) }));
    const { logoutAction$, stories$ } = intent(DOM, api);

    const apiRequest$ = Observable.just({ type: "fetchStories" });
    const timelineApiRequests$ = timeline$.flatMap(timeline => timeline.api).do(console.log.bind(console));

    stories$.subscribe(storiesProxy$);

    return {
        DOM: view(user$, timeline$.map(timeline => timeline.DOM)),
        api: Observable.merge(apiRequest$, timelineApiRequests$),
        logoutAction$
    }
}

export default App;
