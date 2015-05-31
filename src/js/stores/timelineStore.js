/*global require, module*/
(function () {
    "use strict";
    var appDispatcher = require("../dispatcher/appDispatcher"),
        actions = require("../constants/constants").actions,
        EventEmitter = require("events").EventEmitter,
        assign = require("object-assign"),
        hash = require("string-hash");

    var timelines = [];

    /**
     * getFrontId - generate an id specific to the frontend
     * of the app
     *
     * @param {Object} timeline - the timeline of which we will generate a front id
     * @return {String} frontId - the generated id
     */
    function getFrontId(timeline) {
        return "front-" + hash(timeline.title);
    }

    /**
     * findTimelineIndex - find a timeline index in the timelines array
     * using its id or frontId
     *
     * @param {String} id - the id of the timeline to find
     * @return {Number} index - the index of the timeline in the timelines array
     */
    function findTimelineIndex(id) {
        return timelines.reduce(function (prev, t, index) {
            return t.id === id || t.frontId === id ? index : prev;
        }, -1);
    }

    function update(id, data) {
        var i = findTimelineIndex(id);
        timelines[i] = JSON.parse(JSON.stringify(data));
    }


    var timelineStore = assign({}, EventEmitter.prototype, {

        get: function () {
            return timelines;
        },

        addChangeListener: function (callback) {
            this.on("CHANGE", callback);
        },

        removeChangeListener: function (callback) {
            this.removeListener("CHANGE", callback);
        },

        emitChange: function () {
            this.emit("CHANGE");
        }
    });

    appDispatcher.register(function (payload) {
        var action = payload.action,
            data = payload.data;

        switch (action) {
            case actions.RECEIVE_TIMELINES:
                timelines = data.timelines;
                this.emitChange();
                break;

            case actions.CREATE_TIMELINE:
                var timeline = data.timeline;
                timeline.frontId = getFrontId(timeline);
                timelines.push(timeline);
                this.emitChange();
                break;

            case actions.RECEIVE_UPDATED_TIMELINE:
                update(data.timeline.id, data.timeline);
                this.emitChange();
                break;

            case actions.REMOVE_TIMELINE:
                timelines = timelines.filter(t => t.id !== data.timeline.id);
                this.emitChange();
                break;

            case actions.RECEIVE_CREATED_TIMELINE:
                var id = getFrontId(data.timeline);
                update(id, data.timeline);
                this.emitChange();
                break;

            default:
                break;
        }
    }.bind(timelineStore));

    module.exports = timelineStore;
}());
