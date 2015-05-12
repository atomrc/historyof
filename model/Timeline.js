/*eslint-env node */

"use strict";
var mongoose = require("mongoose");

var TimelineSchema = new mongoose.Schema({
    owner: mongoose.Schema.Types.ObjectId,
    title: String,
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event"}]
});

var Timeline = mongoose.model("Timeline", TimelineSchema);

TimelineSchema.virtual("id").get(function(){
    return this._id.toHexString();
});

TimelineSchema.virtual("created").get(function(){
    return this._id.getTimestamp();
});

TimelineSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
    },
    virtuals: true
});

module.exports = Timeline;
