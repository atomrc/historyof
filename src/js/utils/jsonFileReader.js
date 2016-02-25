/*global require, module, window*/
"use strict";
var actions = require("../constants/constants").actions;

module.exports = {
    /**
     * try to parse a file as a json file
     *
     * @returns {promise} readingPromise
     */
    parse: (file) => {
        function readFile(resolve, reject) {
            let reader = new FileReader();
            reader.onload = (e) => {
                try {
                    let data = JSON.parse(e.target.result);
                    resolve(data);
                } catch (e) {
                    reject(e);
                }
            }
            reader.readAsText(file);
        }
        return new Promise(readFile);
    }
};
