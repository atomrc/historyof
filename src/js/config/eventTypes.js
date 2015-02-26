/*global module*/

(function () {
    "use strict";
    var types = [
        {
            name: "email",
            icon: "fa-envelope"
        },
        {
            name: "sms",
            icon: "fa-mobile"
        },
        {
            name: "situation",
            icon: "fa-home"
        },
        {
            name: "travel",
            icon: "fa-globe"
        },
        {
            name: "love",
            icon: "fa-heart"
        },
        {
            name: "event",
            icon: "fa-bolt"
        }
    ];

    module.exports = {
        getTypes: function () {
            return types;
        },

        getType: function (name) {
            return types.filter(function (t) {
                return t.name === name;
            })[0];
        }
    };

}());
