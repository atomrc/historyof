import xs from "xstream";
import {run} from "@cycle/xstream-run";

import {makeDOMDriver} from "@cycle/dom";
import storageDriver from "@cycle/storage";
import {makeRouterDriver} from 'cyclic-router'
import apiDriver from "./apiDriver";
import makeAuth0Driver from "./drivers/auth0Driver";
import {createHistory} from "history";

import wrap from "./authentication/componentWrapper";
import App from "./components/App";

function main(sources) {
    const {router} = sources;

    const match$ = router.define({
        "/me": wrap(App)
    });

    const page$ = match$
        .map(({ path, value }) => {
            return value(Object.assign({}, sources, {
                router: sources.router.path(path)
            }));
        })
        .remember();

    function sinkGetter(sink) {
        return (component) => component[sink] ? component[sink] : xs.empty();
    }

    return {
        DOM: page$.map(sinkGetter("DOM")).flatten(),
        api: page$.map(sinkGetter("api")).flatten(),
        storage: page$.map(sinkGetter("storage")).flatten(),
        router: page$.map(sinkGetter("router")).flatten(),
        auth0: page$.map(sinkGetter("auth0")).flatten()
    };
}

var drivers = {
    DOM: makeDOMDriver("#main", { transposition: true }),
    api: apiDriver,
    storage: storageDriver,
    auth0: makeAuth0Driver("tDjcxZrzyKB8a5SPqwn4XqJfdSvW4FXi", "atomrc.eu.auth0.com"),
    router: makeRouterDriver(createHistory())
};

run(main, drivers);
