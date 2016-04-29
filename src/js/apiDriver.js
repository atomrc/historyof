import {Observable} from 'rx';
import api from "./api/historyOfApi";

function executeAction(action) {
    switch(action.type) {
        case "login":
            return api.login(action.login, action.password);

        case "fetchUser":
            return api.getUser(action.token);

        case "fetchStories":
            return api.getStories(action.token);

        default:
            throw new Error("unimplemented api action: " + action.type);
    }
}

function apiDriver(action$) {

    const response$$ = action$
        .map((action) => {
            const requestPromise = () => executeAction(action),
                response$ = Observable.fromPromise(requestPromise).replay();

            response$.connect();

            return {
                action: action,
                response$
            };
        })
        .replay();

    response$$.connect();
    return response$$;
}

export default apiDriver;
