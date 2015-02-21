/*eslint-env node */

"use strict";
var dataFile = process.argv[2],
    nbSaved = 0;

var datas = require(dataFile),
    mongoose = require("mongoose"),
    Event = require("../model/Event");

mongoose.connect("mongodb://localhost/historyofus");

datas.forEach(function (data) {
    var event = new Event();
    event.title = data.title;
    event.date = new Date(data.date);
    event.text = data.text;
    event.type = data.type;
    event.save(function (err) {
        if (err) {
            console.log(err);
        }
        nbSaved++;
        if (nbSaved === datas.length) {
            mongoose.connection.close();
        }
    });
});
