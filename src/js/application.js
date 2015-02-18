/*global require*/
(function () {
    "use strict";
    var React = require("react"),
        request = new XMLHttpRequest();

    var EventList = React.createClass({
        render: function() {
            console.log(this.props);
            var eventNodes = this.props.events.map(function (event) {
                return (
                    <div>
                        <h2>{event.title}</h2>
                        <p>{event.text}</p>
                    </div>
                );
            });
            return (
                <div className="eventList"> {eventNodes} </div>
            );
        }
    });

    var Timeline = React.createClass({
        loadEvents: function () {
            var self = this;
            request.onload = function () {
                var events = JSON.parse(this.response);
                self.setState({events: events});
            };

            request.open("get", "//127.0.0.1:1337/events", true);
            request.send();
        },

        getInitialState: function() {
            return {events: []};
        },

        componentDidMount: function() {
          this.loadEvents();
        },

        render: function() {
          console.log(this.props);
          return (
            <div>
              <h1>Timeline</h1>
              <EventList events={this.state.events}/>
            </div>
          );
        }
    });

    React.render(<Timeline/>, document.getElementById("main"));
}());
