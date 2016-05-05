import {Observable} from 'rx';
import api from "./api/historyOfApi";

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
            const response$ = Observable.fromPromise(executeRequest(request)).replay();

            response$.connect();

            return {
                request: request,
                response$
            };
        })
        .replay();

    response$$.connect();
    return response$$;
}

export default apiDriver;
