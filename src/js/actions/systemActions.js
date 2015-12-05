/*global require, module, window*/
"use strict";
var actions = require("../constants/constants").actions;

module.exports = {
    messageSeen: (message) => {
        return {
            type: actions.SYSTEM_MESSAGE_SEEN,
            payload: {
                message: message
            }
        }
    }
};
