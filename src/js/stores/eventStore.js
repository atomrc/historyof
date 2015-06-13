/*global require, module, window*/
(function () {
    "use strict";
    var appDispatcher = require("../dispatcher/appDispatcher"),
        eventActions = require("../constants/constants").actions,
        EventEmitter = require("events").EventEmitter,
        assign = require("object-assign");

    var events;

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
     *
     * @param {String} id - the id of the event to find
     * @return {Number} index - the index of the event in the events array
     */
    function findEventIndex(id) {
        return events.reduce(function (prev, e, index) {
            return e.id === id;
        }, -1);
    }

    /**
     * update - update the event with the given id
     * with the given data
     *
     * @param {String} id - the id
     * @param {Object} data - the new data to inject
     * @return {undefined} void
     */
    function update(id, data) {
        events = events.map(function (e) {
            if (e.id !== id) { return e; }
            var event = JSON.parse(JSON.stringify(data));
            event.date = new Date(event.date);
            return event;
        });
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
     *
     * @param {Object} event - the event to add
     * @return {undefined} void
     */
    function add (event) {
        events = events.concat(event);
    }


    var eventStore = assign({}, EventEmitter.prototype, {
        get: function () {
            return events;
        },

        addChangeListener: function (callback) {
            this.on("CHANGE", callback);
        },

        removeChangeListener: function (callback) {
            this.removeListener("CHANGE", callback);
        },

        emitChange: function () {
            window.setTimeout(() => {
                this.emit("CHANGE");
            }, 0);
        }
    });

    appDispatcher.register(function (payload) {
        var action = payload.action,
            data = payload.data;

        switch (action) {
            case eventActions.LOAD_EVENTS:
                events = null;
                this.emitChange();
                break;

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
                var e = initEvent(data.event);

                update(e.id, e);
                this.emitChange();
                break;

            case eventActions.REMOVE_EVENT:
                remove(data.event);
                this.emitChange();
                break;

            default:
                break;
        }
    }.bind(eventStore));

    module.exports = eventStore;
}());
