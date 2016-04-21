import {run} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import storageDriver from '@cycle/storage';
import apiDriver from "./apiDriver";
import AuthContainer from "./components/AuthContainer";

function main({DOM, api, storage}) {

    const authContainer = AuthContainer({DOM, api, storage});

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
