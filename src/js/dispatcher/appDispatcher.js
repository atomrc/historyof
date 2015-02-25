/*global module*/

(function () {
    "use strict";

    var callbacks = [];

    module.exports = {

        register: function (callback) {
            callbacks.push(callback);
            return callback.length - 1;
        },

        dispatch: function (action, payload) {
            if (!action) {
                console.error("[dispatcher]action cannot be null");
                return;
            }
            callbacks.forEach(function (callback) {
                callback(action, payload);
            });
        }
    };
}());
