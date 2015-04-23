/*global require, module*/

(function () {
    "use strict";

    var Dispatcher = require("flux").Dispatcher,
        assign = require("object-assign");

    var appDispatcher = assign(new Dispatcher(), {
        dispatch: function (action, data) {
            return Dispatcher.prototype.dispatch.call(this, {
                action: action,
                data: data
            });
        }
    });

    module.exports = appDispatcher;
}());
