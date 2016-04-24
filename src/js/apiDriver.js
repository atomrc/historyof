import {Observable} from 'rx';
import api from "./api/historyOfApi";

function apiDriver(action$) {

    function executeAction(action) {
        console.log("[api action]", action);
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
                subscriber.onNext({
                    action: action,
                    response: Observable.fromPromise(executeAction(action))
                });
            });
        })
        .share();
}

export default apiDriver;
