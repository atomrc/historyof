/*global require, module, window*/
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
                dispatcher.dispatch(actions.LOGIN_SUCCESS, { token: data.token, user: data.user });
            })
            .catch(function (data) {
                dispatcher.dispatch(actions.LOGIN_FAILED, { error: data.error });
            });
    },

    logout: function () {
        dispatcher.dispatch(actions.USER_LOGGED_OUT);
    },

    create: function (user) {
        historyOfApi
            .createUser(user)
            .then(function (data) {
                dispatcher.dispatch(actions.LOGIN_SUCCESS, { token: data.token, user: data.user });
            });
    },

    getUser: function () {
        historyOfApi
            .getUser()
            .then(function (data) {
                dispatcher.dispatch(actions.RECEIVE_USER, { user: data });
            }, function () {
                dispatcher.dispatch(actions.USER_LOGGED_OUT);
            });
    }
};
