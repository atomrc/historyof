/*eslint-env node */

"use strict";
var db = require("../db/db"),
    Promise = require("es6-promise").Promise;

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
            .getStories({ include: { model: db.model("tag"), through: { attributes: [] }}})
            .then(function (events) {
                res.send(events);
            });
    },

    create: function (req, res) {
        req.body.user_id = req.user.id;
        var newEvent = req.body;

        //filter the tag ids to fetch them from DB then associate
        //them to the event being created
        var tagIds = (newEvent.tags || []).filter(function (t) {
            return typeof t === "string";
        });
        var tagPromise = db.model("tag").findAll({
            where: {
                id: {
                    in: tagIds
                }
            }
        });

        //on let the new tags on the entity to be created
        newEvent.tags = (newEvent.tags || []).filter(function (t) {
            return typeof t !== "string";
        });

        db
            .model("story")
            .create(newEvent, { include: [db.model("tag")]})
            .then(function (event) {
                tagPromise.then(function (tags) {
                    if (tags.length === 0) {
                        return res.send(event.toJSON());
                    }
                    event
                        .addTags(tags)
                        .then(function () {
                            //reload event to get all the tags
                            //sequelize should return the instance
                            //with the tags associated ...
                            event
                                .reload({ include: [db.model("tag")] })
                                .then(function (e) {
                                    return res.send(e.toJSON());
                                });
                        });
                });
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
