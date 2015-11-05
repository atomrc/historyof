/*global require, module, window*/
"use strict";
var appDispatcher = require("../dispatcher/appDispatcher"),
    TokenStore = require("./TokenStore"),
    UserStore = require("./UserStore"),
    LoginErrorStore = require("./LoginErrorStore"),
    EventsStore = require("./EventsStore"),
    EditedEventStore = require("./EditedEventStore");

var classes = {
        tokenStore: TokenStore,
        userStore: UserStore,
        eventsStore: EventsStore,
        loginErrorStore: LoginErrorStore,
        editedEventStore: EditedEventStore
    },
    instances = [];

/**
 * object responsible for creating stores when asked
 * all stores will always be singletons and the
 * second time a store is asked the instance will be 
 * returned instead of a new object
 *
 * @return {undefined}
 */
var storeFactory = {
    get(key) {
        if (!classes[key]) {
            throw new Error("cannot find store: " + key);
        }
        instances[key] = instances[key] || new classes[key](appDispatcher);
        return instances[key];
    }
};

module.exports = storeFactory;
