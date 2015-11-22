/*global require, module, window*/
"use strict";
var actions = require("../constants/constants").actions,
    historyOfApi = require("../api/historyOfApi");

module.exports = {
    login: (login, password) => {
        return (dispatch) => {
            historyOfApi
                .login(login, password)
                .then(function (data) {
                    dispatch({
                        type: actions.LOGIN_SUCCESS,
                        payload: {
                            token: data.token,
                            user: data.user
                        }
                    });
                })
                .catch(function (data) {
                    dispatch({
                        type: actions.LOGIN_FAILED,
                        payload: {
                            error: data.error
                        }
                    });
                });
        }
    },

    logout: () => {
        return { type: actions.USER_LOGGED_OUT }
    },

    create: function (user) {
        historyOfApi
            .createUser(user)
            .then(function (data) {
                //dispatcher.dispatch(actions.LOGIN_SUCCESS, { token: data.token, user: data.user });
            });
    },

    getUser: (token) => {
        return (dispatch) => {
            historyOfApi
                .getUser(token)
                .then(function (data) {
                    dispatch({
                        type: actions.RECEIVE_USER,
                        payload: {
                            user: data
                        }
                    });
                }, function (data) {
                    dispatch({type: actions.USER_AUTH_FAILED, error: data.error});
                });
        }
    }
};
