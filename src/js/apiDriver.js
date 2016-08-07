import xs from "xstream";
import api from "./api/historyOfApi";

function responseSelector(response$$) {
    return function select(selector) {
        const filters = !selector ?
            [] :
            selector
                .replace(" ", "")
                .split(",")

        const request$ = response$$
            .filter(request => filters.length === 0 || filters.indexOf(request.action) > -1)

        const response$ = request$
            .map(req => req.response$)
            .flatten()

        const done$ = response$
            .replaceError(() => xs.empty());

        const error$ = response$
            .replaceError(error => xs.of({ error: error }))
            .filter(response => !!response.error)

        return {
            start$: request$,
            done$: done$,
            error$: error$
        };
    }
}

function executeRequest(request) {
    const apiAction = api[request.action]
        ? api[request.action]
        : () => { throw new Error("[API ERROR] Uninplemented api action: " + request.action) };

    return request.token
        ? apiAction(request.token, request.params)
        : apiAction(request.params);
}

function apiDriver(request$) {
    const response$$ = request$
        .map((request) => {
            const response$ = xs.fromPromise(executeRequest(request))

            return {
                ...request,
                response$
            };
        })

    //response$$.addListener({next: () => {}, error: console.error.bind(console), complete: () => {}});
    const select = responseSelector(response$$);

    return {
        ...select(),
        select
    };
}

export default apiDriver;
