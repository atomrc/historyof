import {run} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import isolate from '@cycle/isolate';
import Timeline from "./components/Timeline";
import assign from "object-assign";
import apiDriver from "./apiDriver";

function main({DOM, api}) {
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
    };
}

var drivers = {
    DOM: makeDOMDriver("#main"),
    api: apiDriver
};

run(main, drivers);
