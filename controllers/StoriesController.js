/*eslint-env node */

"use strict";
var db = require("../db/db"),
    assign = require("object-assign");

module.exports = {
    middlewares: {
        find: function (req, res, next) {
            db
                .model("story")
                .findOne({
                    where: { user_id: req.user.id, id: req.params.eid }
                })
                .then(function (story) {
                    if (!story) {
                        var error = new Error("Story not found");
                        error.status = 404;
                        return next(error);
                    }
                    req.story = story;
                    next();
                });
        }
    },

    getAll: function (req, res) {
        req
            .user
            .getStories()
            .then(function (stories) {
                res.send(stories);
            });
    },

    create: function (req, res) {
        req.body.user_id = req.user.id;

        db
            .model("story")
            .create(req.body)
            .then(function (story) {
                res.send(story.toJSON());
            });
    },

    get: function (req, res) {
        res.send(req.story.toJSON());
    },

    remove: function (req, res) {
        req
            .story
            .destroy()
            .then(function () {
                res.status(204).send();
            });

    },

    update: function (req, res, next) {
        req
            .story
            .update(req.body)
            .then(function (story) {
                res.send(story.toJSON());
            });
    }
};