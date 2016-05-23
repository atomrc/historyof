import {Observable} from "rx";
import {run} from '@cycle/core';
import {makeDOMDriver, div} from '@cycle/dom';
import storageDriver from '@cycle/storage';
import isolate from '@cycle/isolate';
import apiDriver from "./apiDriver";
import AuthContainer from "./components/AuthContainer";

function buildComponent(ComponentFn, props, scope) {
    return isolate(ComponentFn, scope)(props);
}

function main({DOM, api, storage}) {

    const authContainer = AuthContainer({ DOM, api, storage, props: { buildComponent } });

    const vtree = Observable.combineLatest(
            authContainer.DOM,
            authContainer.error$.startWith(null),
            (authContainerDom, error) => ({ authContainerDom, error })
        )
        .map(({ authContainerDom, error }) => {
            var errorDiv = error ? div(".error", error.error) : null;
            return div([
                errorDiv,
                authContainerDom
            ]);
        });

    return {
        DOM: vtree,
        api: authContainer.api,
        storage: authContainer.storage
    }
}

var drivers = {
    DOM: makeDOMDriver("#main"),
    api: apiDriver,
    storage: storageDriver
};

run(main, drivers);
