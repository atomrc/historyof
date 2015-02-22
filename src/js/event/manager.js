/*global module, document*/

(function (doc) {
    "use strict";

    module.exports = {
        setEventListeners: function (listeners, up) {
            var setListenerFn = up ?
                "addEventListener" :
                "removeEventListener";

            for (var e in listeners) {
                doc[setListenerFn](e, listeners[e]);
            }
        },

        dispatchEvent: function (name, data) {
            doc.dispatchEvent(new CustomEvent(name, { detail: data }));
        }
    };
}(document));
