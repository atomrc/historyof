(function () {
    "use strict";
    var request = new XMLHttpRequest();
    request.onload = function () {
        var events = JSON.parse(this.response);
        events.map(function (event) {
            var element = document.createElement("h1");
            var content = document.createElement("div");
            element.innerHTML = event.title;
            content.innerHTML = event.text;
            document.body.appendChild(element);
            document.body.appendChild(content);
        });
    };
    request.open("get", "//127.0.0.1:1337/events", true);
    request.send();
}());
