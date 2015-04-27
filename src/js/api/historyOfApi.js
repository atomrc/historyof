/*global require, module, fetch*/
(function () {
    "use strict";
    var assign = require("object-assign"),
        fetchPolyfill = require("whatwg-fetch");

    var config = {
        loginUrl: "/login",
        urlPattern: "/u/timelines/:tid/events/:eid"
    };

    function request(url, userToken, params) {
        var conf = assign({}, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": userToken ? "Bearer " + userToken : null,
                "Content-Type": "application/json"
            }
        }, params);

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

        getUser: function (userToken) {
            return request(generateUrl(config.urlPattern), userToken);
        },

        save: function (event) {
            request(generateUrl(config.urlPattern), {
                method: "POST",
                body: event
            });
        },

        update: function (event) {
            request(generateUrl(config.urlPattern, { id: event.id }), {
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

    module.exports = api;
}());
