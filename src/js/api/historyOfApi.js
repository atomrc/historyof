/*global require, module, fetch*/
(function () {
    "use strict";
    var assign = require("object-assign"),
        appDispatcher = require("../dispatcher/appDispatcher"),
        actions = require("../constants/constants").actions,
        fetchPolyfill = require("whatwg-fetch");

    var config = {
            loginUrl: "/login",
            urlPattern: "/u/timelines/:tid/events/:eid"
        },
        token;

    function request(url, params) {
        var conf = assign({}, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }, params);

        if (token) {
            conf.headers.Authorization = "Bearer " + token;
        }

        conf.body = conf.body ? JSON.stringify(conf.body) : undefined;

        return fetch(url, conf)
            .then(function (response) {
                return response.json();
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

    function initEvent(event) {
        event.date = new Date(event.date);
        return event;
    }

    var api = {
        login: function (login, password) {
            return request(config.loginUrl, null, {
                method: "POST",
                body: {
                    login: login,
                    password: password
                }
            });
        },

        getUser: function () {
            return request("/u");
        },

        getTimeline: function (tid) {
            return request("/u/timelines/" + tid);
        },

        createTimeline: function (timeline) {
            return request("/u/timelines", {
                method: "POST",
                body: timeline
            });
        },

        updateTimeline: function (tid, timeline) {
            return request("/u/timelines/" + tid, {
                method: "PUT",
                body: timeline
            });
        },

        removeTimeline: function (timeline) {
            request("u/timelines/" + timeline.id, {
                method: "DELETE"
            });
        },

        createEvent: function (tid, event) {
            return request("/u/timelines/" + tid + "/events", {
                method: "POST",
                body: event
            });
        },

        updateEvent: function (tid, event) {
            request(generateUrl(config.urlPattern, { tid: tid, eid: event.id }), {
                method: "PUT",
                body: event
            });
        },

        remove: function (event) {
            request(generateUrl(config.urlPattern, { id: event.id }), {
                method: "DELETE"
            });
        }
    };

    appDispatcher.register(function (payload) {
        var action = payload.action,
            data = payload.data;

        switch (action) {
            case actions.RECEIVE_USER_TOKEN:
                token = data.token;
                break;

            default:
                break;
        }
    });

    module.exports = api;
}());
