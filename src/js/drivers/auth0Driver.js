import xs from "xstream";
import Auth0Lock from "auth0-lock";

var lock;

const actions = {
    "show": function (lock, params) {
        lock.show(params);
        return false;
    },

    "parseHash": function (lock, locationHash) {
        var promise = new Promise((resolve, reject) => {
            var hash = lock.parseHash(locationHash);
            if (!hash) {
                return reject(false);
            }

            if (hash.error) {
                return reject(`[Auth0] There was an error logging in: ${hash.error}`);
            }

            return resolve(hash.id_token);
        });

        return promise;
    },

    "getProfile": function (lock, token) {
        return new Promise((resolve, reject) => {
            lock.getProfile(token, function (err, profile) {
                if (err) {
                    return reject(err);
                }
                return resolve(profile);
            });
        })
    }

};

function auth0Driver(action$, streamAdapter) {
    const response$$ = action$
        .map(action => {
            var actionFn = actions[action.action];
            if (!actionFn) {
                console.error(`[Auth0Driver] not available method: ${action.action}`);
                return false;
            }
            var promise = actionFn(lock, action.params);
            return {
                action: action,
                response$: promise ? xs.fromPromise(promise) : xs.empty()
            }
        })
        .filter(response => !!response);

    response$$.addListener({
        next: () => {},
        error: () => {},
        complete: () => {}
    });

    return response$$;
}

function makeAuth0Driver(key, domain) {
    lock = new Auth0Lock(key, domain);

    return auth0Driver;
}

export default makeAuth0Driver;
