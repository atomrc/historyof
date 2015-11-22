/*global require, module, fetch*/
(function () {
    "use strict";
    var assign = require("object-assign"),
        fetchPolyfill = require("whatwg-fetch");

    var config = {
        loginUrl: "/user/authenticate",
        urlPattern: "/u/events/:eid"
    };

    function request(url, params) {
        params.method = params.method ? params.method : "GET";
        params.headers = assign({}, {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }, params.headers);

        params.body = params.body ? JSON.stringify(params.body) : undefined;

        return fetch(url, params)
            .then(function (response) {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .catch(function (response) {
                return response
                    .json()
                    .then(function (error) {
                        throw error;
                    });
            });
    }

    function requestProtected(url, token, params) {
        if (!token) {
            throw new Error("requesting protected ressource with no token");
        }

        var conf = assign({}, {
            headers: {
                Authorization: "Bearer " + token
            }
        }, params);

        return request(url, conf);
    }

    function generateUrl(url, data) {
        data = data || {};
        for (var i in data) {
            url = url.replace(":" + i, data[i]);
        }
        //cut the end of the pattern to remove unbinded datas
        return url.replace(/\/:.*/g, "");
    }

    function initEvent (event) {
        event.date = new Date(event.date);
        return event;
    }

    var api = {
        login: function (login, password) {
            return request(config.loginUrl, {
                method: "POST",
                body: {
                    login: login,
                    password: password
                }
            });
        },

        checkLogin: function (login) {
            return request("/check/login/" + login);
        },

        checkPseudo: function (pseudo) {
            return request("/check/pseudo/" + pseudo);
        },

        getUser: function (token) {
            return requestProtected("/u", token);
        },

        createUser: function (user) {
            return request("/user/create", {
                method: "POST",
                body: user
            });
        },

        getEvents: function (token) {
            return requestProtected("/u/events", token)
                .then((events) => {
                    return events.map(initEvent)
                });
        },

        createEvent: function (token, event) {
            return requestProtected("/u/events", token, {
                    method: "POST",
                    body: event
                }).then(initEvent);
        },

        updateEvent: function (token, event) {
            requestProtected(generateUrl(config.urlPattern, { eid: event.id }), token, {
                method: "PUT",
                body: event
            }).then(initEvent);
        },

        remove: function (token, event) {
            requestProtected(generateUrl(config.urlPattern, token, { eid: event.id }), {
                method: "DELETE"
            });
        }
    };

    module.exports = api;
}());
