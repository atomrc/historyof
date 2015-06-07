/*global require, module, window*/
(function () {
    "use strict";
    var actions = require("../constants/constants").actions,
        dispatcher = require("../dispatcher/appDispatcher");

    module.exports = {
        getToken: function () {
            var token = window.localStorage.getItem("token") ?
                window.localStorage.getItem("token") :
                null;

            if (!token) {
                return false;
            }
            dispatcher.dispatch(actions.RECEIVE_USER_TOKEN, { token: token });
            return true;
        }

    };
}());
