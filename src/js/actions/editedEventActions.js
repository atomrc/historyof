/*global require, module*/
(function () {
    "use strict";
    var actions = require("../constants/constants").actions,
        dispatcher = require("../dispatcher/appDispatcher");

    module.exports = {
        update(updates) {
            dispatcher.dispatch(actions.UPDATE_EDITED_EVENT, {updates: updates});
        }
    };
}());
