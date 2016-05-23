import {xs} from 'xstream';
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
            const response$ = xs.fromPromise(executeRequest(request))

            return {
                request: request,
                response$
            };
        })

    return response$$;
}

export default apiDriver;
