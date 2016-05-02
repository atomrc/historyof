import {Observable, ReplaySubject} from "rx";
import {run} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import storageDriver from '@cycle/storage';
import apiDriver from "./apiDriver";
import AuthContainer from "./components/AuthContainer";
import App from "./components/App";

function main({DOM, api, storage}) {

    const userProxy$ = new ReplaySubject();

    const app$ = userProxy$
        .map(user => App({ DOM, api, user$: Observable.just(user) }))
        .shareReplay();

    const authContainer = AuthContainer({DOM, api, storage, app$});
    authContainer.user$.subscribe(userProxy$);

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
