import {run} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import apiDriver from "./apiDriver";
import App from "./components/App";

function main({DOM, api}) {
    const app = App({DOM, api, token: "okman"});

    return {
        DOM: app.DOM,
        api: app.api
    }
}

var drivers = {
    DOM: makeDOMDriver("#main"),
    api: apiDriver
};

run(main, drivers);
