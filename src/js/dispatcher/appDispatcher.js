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
            callbacks.forEach(function (callback) {
                callback(action, payload);
            });
        }
    };
}());
