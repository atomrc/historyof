(function () {
    "use strict";
    var React = require("react"),
        Event = require("./event");

    /**
     * Will handle and display all the event of the timeline
     * Is also responsible for the global state of the application
     *
     * @return {undefined}
     */
    var Timeline = React.createClass({
        getInitialState: function() {
            return {events: []};
        },

        loadEvents: function () {
            var self = this,
                request = new XMLHttpRequest();
            request.onload = function () {
                var events = JSON.parse(this.response);
                self.setState({events: events.map(function (event) {
                    event.date = new Date(event.date);
                    return event;
                })});
            };

            request.open("get", "//127.0.0.1:1337/events", true);
            request.send();
        },

        eventCreated: function (event) {
            this.setState({
                events: this.state.events.concat(event.detail)
            });
        },

        componentDidMount: function() {
          document.addEventListener("eventCreated", this.eventCreated);
          this.loadEvents();
        },

        componentWillUnmount: function () {
            document.removeEventListener("eventCreated");
        },

        render: function() {
            var eventNodes = this.state.events
                .sort(function (e1, e2) {
                    if (e1.date === e2.date) { return 0; }
                    return e1.date < e2.date ? -1 : 1;
                })
                .map(function (event) {
                    return (
                        <Event event={event} key={event.id + '-' + event.title}/>
                    );
                });

            return (
            <div>
              <h1>Timeline</h1>
                <div className="eventList"> {eventNodes} </div>
            </div>
            );
        }
    });

    module.exports = Timeline;
}());
