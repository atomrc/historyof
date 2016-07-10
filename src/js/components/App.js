import xs from "xstream";
import {div, button, span} from "@cycle/dom";
import Timeline from "./Timeline/Timeline";

function render({user, timeline}) {
    const header = div("#app-header", [
        span(".pseudo", user.nickname),
        button(".logout", "Logout")
    ]);

    return div("#app", [
        header,
        timeline
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
        stories$: storiesResponse$.filter(res => !res.error)
    };
}

function view(user$, timelineView$) {
    return xs.combine(
            user$,
            timelineView$
        )
        .map(([user, timeline]) => ({user, timeline}))
        .map(render);
}

function App({DOM, api, props}) {
    const { user$ } = props;
    const { logoutAction$, stories$ } = intent(DOM, api);

    const timeline = Timeline({ DOM, api, props: { stories$ }})

    const apiRequest$ = user$.mapTo({ action: "fetchStories" });

    return {
        DOM: view(user$, timeline.DOM),
        api: xs.merge(apiRequest$, timeline.api),
        action$: logoutAction$
    }
}

export default App;
