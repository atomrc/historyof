import isolate from '@cycle/isolate';
import Timeline from "./Timeline/Timeline";
import assign from "object-assign";

function App({DOM, api, token}) {

    const stories$ = api
        .filter(request => request.action.type === "fetchStories")
        .map(({ response }) => response);

    const timeline = isolate(Timeline)({DOM, stories$: stories$});

    return {
        DOM: timeline.DOM,
        api: timeline
            .action$
            .map((action) =>
                //décorate the action that is given to the api
                //with the user's token that authenticate him against the
                //server
                assign({}, action, { token: "felix" })
            )
            .startWith({ type: "fetchStories" })
    }
}

export default App;
