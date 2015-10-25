/*global require, module, fetch*/
(function () {
    "use strict";
    var assign = require("object-assign"),
        tokenStore = require("../stores/tokenStore"),
        fetchPolyfill = require("whatwg-fetch");

    var config = {
        loginUrl: "/login",
        urlPattern: "/u/events/:eid"
    };

    function request(url, params) {
        var conf = assign({}, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }, params);

        var token = tokenStore.get();

        if (token) {
            conf.headers.Authorization = "Bearer " + token;
        }

        conf.body = conf.body ? JSON.stringify(conf.body) : undefined;

        return fetch(url, conf)
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

    function generateUrl(url, data) {
        data = data || {};
        for (var i in data) {
            url = url.replace(":" + i, data[i]);
        }
        //cut the end of the pattern to remove unbinded datas
        return url.replace(/\/:.*/g, "");
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
            return request("/login/available/" + login);
        },

        checkPseudo: function (pseudo) {
            return request("/pseudo/available/" + pseudo);
        },

        getUser: function () {
            return request("/u");
        },

        createUser: function (user) {
            return request("/user/create", {
                method: "POST",
                body: user
            });
        },

        getEvents: function () {
            return request("/u/events");
        },

        createEvent: function (event) {
            return request("/u/events", {
                method: "POST",
                body: event
            });
        },

        updateEvent: function (event) {
            request(generateUrl(config.urlPattern, { eid: event.id }), {
                method: "PUT",
                body: event
            });
        },

        remove: function (event) {
            request(generateUrl(config.urlPattern, { eid: event.id }), {
                method: "DELETE"
            });
        }
    };

    module.exports = api;
}());
