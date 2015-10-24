/*global require, module, window*/
(function () {
    "use strict";
    var actions = require("../constants/constants").actions,
        dispatcher = require("../dispatcher/appDispatcher"),
        historyOfApi = require("../api/historyOfApi");

    module.exports = {
        login: function (login, password) {
            dispatcher.dispatch(actions.USER_LOGIN);

            return historyOfApi
                .login(login, password)
                .then(function (data) {
                    window.localStorage.setItem("token", data.token);
                    dispatcher.dispatch(actions.RECEIVE_USER_TOKEN, { token: data.token });
                    dispatcher.dispatch(actions.RECEIVE_USER, { user: data.user });
                });
        },

        logout: function () {
            window.localStorage.clear();
            dispatcher.dispatch(actions.USER_LOGGED_OUT);
        },

        create: function (user) {
            historyOfApi
                .createUser(user)
                .then(function (data) {
                    window.localStorage.setItem("token", data.token);
                    dispatcher.dispatch(actions.RECEIVE_USER_TOKEN, { token: data.token });
                    dispatcher.dispatch(actions.RECEIVE_USER, { user: data.user });
                });
        },

        getUser: function () {
            historyOfApi
                .getUser()
                .then(function (data) {
                    dispatcher.dispatch(actions.RECEIVE_USER, { user: data });
                }, function () {
                    window.localStorage.clear();
                    dispatcher.dispatch(actions.USER_LOGGED_OUT, {});
                });
        }
    };
}());
