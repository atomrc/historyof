/*global require, fetch*/
(function () {
    "use strict";
    var fetchPolyfill = require("whatwg-fetch");

    var config = {
        urlPattern: "/events/:id"
    };

    function generateUrl(url, data) {
        data = data || {};
        for (var i in data) {
            url = url.replace(":" + i, data[i]);
        }
        return url.replace(/\/:[^\/]*/g, "");
    }

    function initEvent(event) {
        event.date = new Date(event.date);
        return event;
    }

    var api = {

        fetchAll: function () {
            return fetch(generateUrl(config.urlPattern))
                .then(function (response) {
                    return response.json();
                });
        },

        save: function (event) {
            fetch(generateUrl(config.urlPattern), {
                method: "POST",
                body: JSON.stringify(event),
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            }).then(function (response) {
                return response.json();
            });
        },

        update: function (event) {
            fetch(generateUrl(config.urlPattern, { id: event.id }), {
                method: "PUT",
                body: JSON.stringify(event),
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            }).then(function (response) {
                return response.json();
            });
        },

        remove: function (event) {
            fetch(generateUrl(config.urlPattern, { id: event.id }), {
                method: "DELETE"
            }).then(function (response) {
                return response.json();
            });
        }
    };

    module.exports = api;
}());
