/*global require, module*/
var combineReducers = require("redux").combineReducers,
    routerStateReducer = require("redux-router").routerStateReducer;

let userReducer = require("./userReducer"),
    tokenReducer = require("./tokenReducer"),
    storiesReducer = require("./storiesReducer"),
    errorsReducer = require("./errorsReducer"),
    storyEditorReducer = require("./storyEditorReducer");

var appReducers = combineReducers( {
    user: userReducer,
    token: tokenReducer,
    stories: storiesReducer,
    storyEditor: storyEditorReducer,
    errors: errorsReducer,
    router: routerStateReducer
});

module.exports = appReducers;
