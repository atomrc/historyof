/*global require, fetch*/
(function () {
    "use strict";
    var appDispatcher = require("../dispatcher/appDispatcher"),
        eventActions = require("../dispatcher/eventActions"),
        fetchPolyfill = require("whatwg-fetch");

    var config = {
        urlPattern: "//127.0.0.1:1337/events/:id"
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

    var backendManager = {

        fetchAll: function () {
            fetch(generateUrl(config.urlPattern))
                .then(function (response) {
                    return response.json();
                })
                .then(function (events) {
                    appDispatcher.dispatch(eventActions.updateAll, events.map(initEvent));
                });
        },

        save: function (event) {
            fetch(generateUrl(config.urlPattern), {
                method: "POST",
                body: JSON.stringify(event)
            }).then(function (response) {
                return response.json();
            }).then(function (savedEvent) {
                appDispatcher.dispatch(eventActions.confirmCreate, initEvent(savedEvent));
            });
        },

        update: function (event) {
            fetch(generateUrl(config.urlPattern, { id: event.id }), {
                method: "PUT",
                body: JSON.stringify(event)
            }).then(function (response) {
                return response.json();
            }).then(function () {
                appDispatcher.dispatch(eventActions.confirmUpdate, event);
            });
        },

        remove: function (event) {
            fetch(generateUrl(config.urlPattern, { id: event.id }), {
                method: "DELETE"
            }).then(function (response) {
                return response.json();
            }).then(function (removedEvent) {
                appDispatcher.dispatch(eventActions.confirmRemove, initEvent(removedEvent));
            });
        }
    };

    appDispatcher.register(function (action, payload) {
        switch (action) {
            case eventActions.create:
                this.save(payload);
                break;

            case eventActions.remove:
                this.remove(payload);
                break;

            case eventActions.update:
                this.update(payload);
                break;

            default:
                break;

        }
    }.bind(backendManager));

    module.exports = backendManager;
}());
