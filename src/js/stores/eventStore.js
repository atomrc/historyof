/*global require, module*/
(function () {
    "use strict";
    var appDispatcher = require("../dispatcher/appDispatcher"),
        eventActions = require("../constants/constants").actions,
        hash = require("string-hash");

    var listeners = [],
        events = [];

    /**
     * getFrontId - generate an id specific to the frontend
     * of the app
     *
     * @param {Object} event - the event of which we will generate a front id
     * @return {String} frontId - the generated id
     */
    function getFrontId(event) {
        return "front-" + hash(event.title);
    }

    /**
     * initEvent - init the object of the event
     * (the date from the datestr from the server
     *
     * @param {Object} event - the event to init
     * @return {Objet} event - the inited event
     */
    function initEvent(event) {
        event.date = new Date(event.date);
        return event;
    }

    /**
     * findEventIndex - find an event index in the events array
     * using its id or frontId
     *
     * @param {String} id - the id of the event to find
     * @return {Number} index - the index of the event in the events array
     */
    function findEventIndex(id) {
        return events.reduce(function (prev, e, index) {
            return e.id === id || e.frontId === id ? index : prev;
        }, -1);
    }

    /**
     * update - update the event with the given id
     * with the given data
     *
     * @param {String} id - the id or frontId of the event
     * @param {Object} data - the new data to inject
     * @return {undefined} void
     */
    function update(id, data) {
        var i = findEventIndex(id);
        events[i] = JSON.parse(JSON.stringify(data));
        events[i].date = new Date(events[i].date);
    }

    /**
     * remove - remove the event from the events array
     *
     * @param {Object} event - the event to remove
     * @return {undefined} void
     */
    function remove (event) {
        events = events.filter(function (e) {
            return e.id !== event.id;
        });
    }

    /**
     * add - add an event to the events array
     * this will add a frontId property to the event
     * in order for it to be found event when not already
     * saved in the DB
     *
     * @param {Object} event - the event to add
     * @return {undefined} void
     */
    function add (event) {
        event.frontId = getFrontId(event);
        events = events.concat(event);
    }


    var eventsManager = {
        getAll: function () {
            return events;
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

    appDispatcher.register(function (payload) {
        var action = payload.action,
            data = payload.data;

        switch (action) {
            case eventActions.RECEIVE_EVENTS:
                events = data.events.map(initEvent);
                this.emitChange();
                break;

            case eventActions.CREATE_EVENT:
                add(data.event);
                this.emitChange();
                break;

            case eventActions.UPDATE_EVENT:
                update(data.event.id, data.event);
                this.emitChange();
                break;

            case eventActions.RECEIVE_CREATED_EVENT:
                var e = initEvent(data.event),
                    frontId = getFrontId(e);

                update(frontId, e);
                this.emitChange();
                break;

            case eventActions.REMOVE_EVENT:
                remove(data.event);
                this.emitChange();
                break;

            default:
                break;
        }
    }.bind(eventsManager));

    module.exports = eventsManager;
}());
