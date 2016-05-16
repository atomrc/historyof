import {run} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import storageDriver from '@cycle/storage';
import isolate from '@cycle/isolate';
import apiDriver from "./apiDriver";
import AuthContainer from "./components/AuthContainer";

function buildComponent(ComponentFn, props, scope) {
    return isolate(ComponentFn, scope)(props);
}

function main({DOM, api, storage}) {

    const authContainer = AuthContainer({ DOM, api, storage, props: { buildComponent } });

    return {
        DOM: authContainer.DOM,
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
