/*global require, module*/
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
                return;
            }
            dispatcher.dispatch(actions.RECEIVE_USER_TOKEN, { token: token });
        },

        login: function (login, password) {
            dispatcher.dispatch(actions.USER_LOGIN);

            historyOfApi
                .login(login, password)
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
                    dispatcher.dispatch(actions.USER_LOGGED_OUT, {});
                });
        }
    };
}());
