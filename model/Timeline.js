/*global require, module*/
"use strict";
var mongoose = require("mongoose"),
    Event = require("./Event");

var TimelineSchema = new mongoose.Schema({
    owner: mongoose.Schema.Types.ObjectId,
    title: String,
    events: [Event.schema]
});

var Timeline = mongoose.model("Timeline", TimelineSchema);

// Duplicate the ID field.
TimelineSchema.virtual("id").get(function(){
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
TimelineSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    },
    virtuals: true
});

module.exports = Timeline;
