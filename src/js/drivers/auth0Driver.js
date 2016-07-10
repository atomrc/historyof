import xs from "xstream";

var lock$;

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
    const response$$ = xs
        .combine(lock$, action$)
        .map(([lock, action]) => {
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

function makeAuth0Driver(key, domain, options) {
    var params = Object.assign({}, {
        scriptSrc: "//cdn.auth0.com/js/lock-9.1.min.js"
    }, options);

    lock$ = xs.create({
        start: (listener) => {
            //loading auth0 script in the DOM
            var auth0Script = document.createElement("script");
            auth0Script.src = params.scriptSrc;
            document.head.appendChild(auth0Script);

            auth0Script.addEventListener("load", function () {
                //create the lock once the script has loaded
                listener.next(new window.Auth0Lock(key, domain));
            });
        },

        stop: () => { }
    });

    return auth0Driver;
}

export default makeAuth0Driver;
