/*global require, module*/
"use strict";
var actions = require("../constants/constants").actions;

module.exports = {
    update(updates) {
        return {
            type:actions.UPDATE_EDITED_EVENT,
            payload: {
                updates: updates
            }
        };
    }
};
