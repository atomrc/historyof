/*global require, module, window*/
(function () {
    "use strict";
    var actions = require("../constants/constants").actions,
        dispatcher = require("../dispatcher/appDispatcher"),
        historyOfApi = require("../api/historyOfApi");

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
        },

        login: function (login, password) {
            dispatcher.dispatch(actions.USER_LOGIN);

            return historyOfApi
                .login(login, password)
                .then(function (data) {
                    window.localStorage.setItem("token", data.token);
                    dispatcher.dispatch(actions.RECEIVE_USER_TOKEN, { token: data.token });
                    dispatcher.dispatch(actions.RECEIVE_USER, { user: data.user });
                    dispatcher.dispatch(actions.RECEIVE_TIMELINES, { timelines: data.user.timelines });
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
                    dispatcher.dispatch(actions.RECEIVE_TIMELINES, { timelines: data.user.timelines });
                });
        },

        getUser: function (token) {
            historyOfApi
                .getUser(token)
                .then(function (data) {
                    dispatcher.dispatch(actions.RECEIVE_USER, { user: data });
                    dispatcher.dispatch(actions.RECEIVE_TIMELINES, { timelines: data.timelines });
                }, function () {
                    window.localStorage.clear();
                    dispatcher.dispatch(actions.USER_LOGGED_OUT, {});
                });
        }
    };
}());
