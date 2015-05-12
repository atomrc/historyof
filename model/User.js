/*eslint-env node */

"use strict";
var mongoose = require("mongoose"),
    Timeline = require("./Timeline");

var UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    password: String,
    login: String,
    timelines: [Timeline.schema]
});

var User = mongoose.model("User", UserSchema);

// Duplicate the ID field.
UserSchema.virtual("id").get(function(){
    return this._id.toHexString();
});

UserSchema.virtual("created").get(function(){
    return this._id.getTimestamp();
});

// Ensure virtual fields are serialised.
UserSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    },
    virtuals: true
});

module.exports = User;
