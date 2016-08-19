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

    function pluck(source$, attr) {
        return source$.map(source => source[attr]).flatten();
    }

    return {
        DOM: pluck(page$, "DOM"),
        api: pluck(page$, "api"),
        router: pluck(page$, "router"),
        auth0: pluck(page$, "auth0")
    };
}

var drivers = {
    DOM: makeDOMDriver("body", { transposition: true }),
    api: apiDriver,
    auth0: makeAuth0Driver("tDjcxZrzyKB8a5SPqwn4XqJfdSvW4FXi", "atomrc.eu.auth0.com", {
        auth: {
            params: { scope: "openid nickname" },
            responseType: "token"
        }
    }),
    router: makeRouterDriver(createHistory())
};

run(main, drivers);
