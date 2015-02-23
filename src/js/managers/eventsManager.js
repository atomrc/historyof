/*global require, fetch*/
(function () {
    "use strict";
    var appDispatcher = require("../dispatcher/appDispatcher"),
        fetchPolyfill = require("whatwg-fetch");

    var listeners = [],
        events = [];

    var eventsManager = {
        getAll: function () {
            return events;
        },

        get: function (id) {
        },

        update: function (id, data) {
        },

        remove: function (id) {
        },

        add: function (event) {
            events = events.concat(event);
            this.emitChange();
        },

        addChangeListener: function (callback) {
            listeners.push(callback);
            return listeners.length - 1;
        },

        emitChange: function () {
            listeners.forEach(function (listener) {
                listener();
            });
        }
    };

    appDispatcher.register(function (action, payload) {
        switch (action) {
            case "create":
                this.add(payload);
                break;
        }
    }.bind(eventsManager));

    (function loadEvents() {
        fetch("//127.0.0.1:1337/events")
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                events = json.map(function (e) {
                    e.date = new Date(e.date);
                    return e;
                });
                eventsManager.emitChange();
            });
    }());

    module.exports = eventsManager;
}());
