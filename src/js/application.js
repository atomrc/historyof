import xs from "xstream";
import {run} from "@cycle/xstream-run";

import {makeDOMDriver} from "@cycle/dom";
import {makeAuth0Driver, protect} from "cyclejs-auth0";
import {makeRouterDriver} from 'cyclic-router'
import apiDriver from "./apiDriver";
import {createHistory} from "history";
import dropRepeats from 'xstream/extra/dropRepeats'

import App from "./components/App";
import Timeline from "./components/Timeline/Timeline";

function compose(Parent, Child) {
    return function (sources) {
        const props = { ...sources.props, Child: Child };
        const decoratedSources = { ...sources, props };

        return Parent(decoratedSources);
    }
}

function main(sources) {
    const {router} = sources;

    const match$ = router.define({
        "/me": protect(compose(App, Timeline), {
            auth0ShowParams: {
                authParams: { scope: "openid nickname" },
                responseType: "token"
            },
            decorators: {
                api: (request, token) => ({ ...request, token })
            }
        })
    });

    const page$ = match$
        .compose(dropRepeats((a, b) => a.path === b.path))
        .map(({ path, value }) => value({ ...sources, router: sources.router.path(path) }))
        .remember();

    function sinkGetter(sink) {
        return (component) => component[sink] ? component[sink] : xs.empty()
    }

    return {
        DOM: page$.map(sinkGetter("DOM")).flatten(),
        api: page$.map(sinkGetter("api")).flatten(),
        router: page$.map(sinkGetter("router")).flatten(),
        auth0: page$.map(sinkGetter("auth0")).flatten()
    };
}

var drivers = {
    DOM: makeDOMDriver("#main", { transposition: true }),
    api: apiDriver,
    auth0: makeAuth0Driver("tDjcxZrzyKB8a5SPqwn4XqJfdSvW4FXi", "atomrc.eu.auth0.com"),
    router: makeRouterDriver(createHistory())
};

run(main, drivers);
