import {run} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import apiDriver from "./apiDriver";
import App from "./components/App";

function main({DOM, api}) {
    const app = App({DOM, api, token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjBlM2JiNDkwLTA1YTctMTFlNi04YWExLTk5Y2M5OGE3ODQwZSIsImlhdCI6MTQ2MTAxNDc5NiwiZXhwIjoxNDYxMDMyNzk2fQ.WgQqBpe9OMPOBgw-0BKhh-71vCOGatfMYq32n7wzCUs"});

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
