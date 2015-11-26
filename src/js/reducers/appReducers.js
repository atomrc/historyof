/*global require, module*/
var combineReducers = require("redux").combineReducers,
    routerStateReducer = require("redux-router").routerStateReducer,
    assign = require("object-assign");

let userReducer = require("./userReducer"),
    tokenReducer = require("./tokenReducer"),
    storiesReducer = require("./storiesReducer"),
    storyEditorReducer = require("./storyEditorReducer");

var appReducers = combineReducers( {
    user: userReducer,
    token: tokenReducer,
    stories: storiesReducer,
    storyEditor: storyEditorReducer,
    router: routerStateReducer
});

module.exports = appReducers;
