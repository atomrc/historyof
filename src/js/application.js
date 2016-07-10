import xs from "xstream";
import {run} from "@cycle/xstream-run";
import {makeDOMDriver, div} from "@cycle/dom";
import isolate from "@cycle/isolate";
import storageDriver from "@cycle/storage";
import apiDriver from "./apiDriver";
import makeAuth0Driver from "./drivers/auth0Driver";
import AuthContainer from "./components/AuthContainer";

function buildComponent(ComponentFn, props, scope) {
    return isolate(ComponentFn, scope)(props);
}

function main({DOM, api, storage, auth0}) {
    const authContainer = AuthContainer({ DOM, api, storage, auth0, props: { buildComponent } });

    const vtree$ = xs.combine(
            authContainer.DOM,
            authContainer.error$.startWith(null)
        )
        .map(([authContainerDom, error]) => ({ authContainerDom, error }))
        .map(({ authContainerDom, error }) => {
            var errorDiv = error ? div(".error", error.error) : null;
            return div([
                errorDiv,
                authContainerDom
            ]);
        });

    return {
        DOM: vtree$,
        api: authContainer.api,
        storage: authContainer.storage,
        auth0: authContainer.auth0
    }
}

var drivers = {
    DOM: makeDOMDriver("#main", { transposition: true }),
    api: apiDriver,
    storage: storageDriver,
    auth0: makeAuth0Driver("tDjcxZrzyKB8a5SPqwn4XqJfdSvW4FXi", "atomrc.eu.auth0.com")
};

run(main, drivers);
