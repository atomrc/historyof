import xs from "xstream";
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
        .mapTo({ type: "logout" });

    const storiesResponse$ = api
        .filter(({ request }) => request.action === "fetchStories")
        .map(({ response$ }) =>
            response$.replaceError(error => xs.of({ error }))
        )
        .flatten()
        .remember();

    return {
        logoutAction$,
        api: xs.of({ action: "fetchStories" }),
        stories$: storiesResponse$.filter(res => !res.error)
    };
}

function view(user$, timeline$) {
    return xs.combine(
            (user, timeline) => ({user, timeline}),
            user$,
            timeline$.startWith(null)
        )
        .map(render);
}

function App({DOM, api, props}) {
    const { user$ } = props;
    const { logoutAction$, stories$ } = intent(DOM, api);

    const timeline$ = stories$
        .map(stories => Timeline({ DOM, api, stories$: xs.of(stories) }))
        .remember();

    const timelineApiRequests$ = timeline$.map(timeline => timeline.api).flatten();

    const apiRequest$ = xs.of({ action: "fetchStories" });

    return {
        DOM: view(user$, timeline$.map(timeline => timeline.DOM).flatten()),
        api: xs.merge(apiRequest$, timelineApiRequests$),
        logoutAction$
    }
}

export default App;
