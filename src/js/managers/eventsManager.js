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
            return events.filter(function (e) {
                return e.id === id;
            })[0];
        },

        getIndex: function (id) {
            return events.reduce(function (prev, e, index) {
                return e.id === id ? index : prev;
            }, -1);
        },

        update: function (id, data) {
            var i = this.getIndex(id);
            events[i] = JSON.parse(JSON.stringify(data));
            events[i].date = new Date(events[i].date);
        },

        remove: function (id) {
            events = events.filter(function (e) {
                return e.id !== id;
            });
        },

        add: function (event) {
            events = events.concat(event);
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
                this.emitChange();
                break;

            case "update":
                this.update(payload.id, payload);
                this.emitChange();
                break;

            case "remove":
                this.remove(payload);
                this.emitChange();
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
