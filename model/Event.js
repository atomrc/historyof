/*global require, module*/
"use strict";
var mongoose = require("mongoose");

var EventSchema = new mongoose.Schema({
    title: String,
    type: String,
    date: Date,
    text: String,
    place: String,
    comment: String,
    created: Date,
    updated: Date
});

var Event = mongoose.model("Event", EventSchema);

EventSchema.pre("save", function (next) {
    if (!this.created) {
        this.created = new Date();
    } else {
        this.updated = new Date();
    }
    next();
});

// Duplicate the ID field.
EventSchema.virtual("id").get(function(){
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
EventSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    },
    virtuals: true
});

module.exports = Event;
