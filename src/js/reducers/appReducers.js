/*global require, module*/
var combineReducers = require("redux").combineReducers,
    routerStateReducer = require("redux-router").routerStateReducer;

let userReducer = require("./userReducer"),
    tokenReducer = require("./tokenReducer"),
    storiesReducer = require("./storiesReducer"),
    systemMessagesReducer = require("./systemMessagesReducer"),
    storyEditorReducer = require("./storyEditorReducer");

var appReducers = combineReducers( {
    user: userReducer,
    token: tokenReducer,
    stories: storiesReducer,
    storyEditor: storyEditorReducer,
    systemMessages: systemMessagesReducer,
    router: routerStateReducer
});

module.exports = appReducers;
