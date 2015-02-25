/*global require, module*/
(function () {
    "use strict";
    var appDispatcher = require("../dispatcher/appDispatcher"),
        eventActions = require("../dispatcher/eventActions"),
        hash = require("string-hash");

    var listeners = [],
        events = [];

    function getFrontId(event) {
        return "front-" + hash(event.title) + hash(event.date.getTime());
    }

    var eventsManager = {

        setEvents: function (es) {
            events = es;
        },

        getAll: function () {
            return events;
        },

        get: function (id) {
            return events.filter(function (e) {
                return e.id === id || e.frontId === id;
            })[0];
        },

        getIndex: function (id) {
            return events.reduce(function (prev, e, index) {
                return e.id === id || e.frontId === id ? index : prev;
            }, -1);
        },

        update: function (id, data) {
            var i = this.getIndex(id);
            events[i] = JSON.parse(JSON.stringify(data));
            events[i].date = new Date(events[i].date);
        },

        remove: function (event) {
            events = events.filter(function (e) {
                return e.id !== event.id;
            });
        },

        add: function (event) {
            event.frontId = getFrontId(event);
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
            case eventActions.updateAll:
                this.setEvents(payload);
                this.emitChange();
                break;

            case eventActions.create:
                this.add(payload);
                this.emitChange();
                break;

            case eventActions.update:
                this.update(payload.id, payload);
                this.emitChange();
                break;

            case eventActions.confirmCreate:
                var frontId = getFrontId(payload);
                this.update(frontId, payload);
                this.emitChange();
                break;

            case eventActions.remove:
                this.remove(payload);
                this.emitChange();
                break;

            default:
                break;
        }
    }.bind(eventsManager));

    module.exports = eventsManager;
}());
