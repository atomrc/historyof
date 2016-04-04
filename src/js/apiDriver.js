import {Observable} from 'rx';
import uuid from "uuid";
//import api from "./api/historyOfApi";

function apiDriver(action$) {

    function executeAction(action) {
        console.log("[API ACTION]", action)
        return [
            { title: "first", id: uuid.v1() },
            { title: "second", id: uuid.v1() }
        ];
    }

    return Observable.create((subscriber) => {
        action$.subscribe((action) => {
            subscriber.onNext({
                action: action,
                response: executeAction(action)
            });
        });
    });
}

export default apiDriver;
