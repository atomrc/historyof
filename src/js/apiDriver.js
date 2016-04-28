import {Observable} from 'rx';
import api from "./api/historyOfApi";

function apiDriver(action$) {

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

    return Observable.create((subscriber) => {
            action$.subscribe((action) => {
                const requestPromise = executeAction(action),
                    response$ = Observable.fromPromise(requestPromise);

                    response$.subscribe(console.log.bind(console));
                subscriber.onNext({
                    action: action,
                    response: response$
                });
            });
        })
        .share();
}

export default apiDriver;
