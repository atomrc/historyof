/*global require, module*/
(function () {
    "use strict";
    var actions = require("../constants/constants").actions,
        dispatcher = require("../dispatcher/appDispatcher"),
        historyOfApi = require("../api/historyOfApi");

    module.exports = {
        login: function (login, password) {
            dispatcher.dispatch(actions.USER_LOGIN);

            historyOfApi
                .login(login, password)
                .then(function (data) {
                    dispatcher.dispatch(actions.RECEIVE_USER_TOKEN, { token: data.token });
                    dispatcher.dispatch(actions.RECEIVE_USER, { user: data.user });
                });
        },

        getUser: function (token) {
            historyOfApi
                .getUser(token)
                .then(function (data) {
                    dispatcher.dispatch(actions.RECEIVE_USER, { user: data });
                })
                .catch(function () {
                    dispatcher.dispatch(actions.USER_LOGGED_OUT, {});
                });
        }
    };
}());
