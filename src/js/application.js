/*global require*/
(function () {
    "use strict";
    var React = require("react");

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

    var Event = React.createClass({
        getInitialState: function () {
            return this.props;
        },

        componentDidMount: function() {
          document.addEventListener("eventUpdated", this.eventUpdated);
        },

        componentWillUnmount: function () {
            document.removeEventListener("eventUpdated");
        },

        editEvent: function () {
            document.dispatchEvent(new CustomEvent("eventEdited", { detail: this.state.event }));
        },

        eventUpdated: function (e) {
            var updatedEvent = e.detail;
            if (updatedEvent.id === this.state.event.id) {
                this.setState({ event: updatedEvent });
            }
        },

        render: function () {
            return (
                <div onClick={this.editEvent}>
                    <h2>{this.state.event.title}</h2>
                    <em>{this.state.event.date.toDateString()}</em>
                    <p dangerouslySetInnerHTML={{__html: this.state.event.text.replace(/\n/g, "<br>")}}></p>
                </div>
            );
        }
    });

    var EventForm = React.createClass({
        getInitialState: function() {
            return { style: { display: "none" }, event: {} };
        },

        saveEvent: function (e) {
            e.preventDefault();
            var event = this.state.event;
            var eventName = event.id ? 
                "eventUpdated" :
                "eventCreated";

            event.date = new Date(event.date);

            document.dispatchEvent(new CustomEvent(eventName, { detail: event }));
            this.replaceState(this.getInitialState());
        },

        editEvent: function (e) {
            this.setState({ style: { display: "block" },  event: e.detail });
        },

        updateEvent: function (event) {
            var stateEvent = this.state.event;
            stateEvent[event.target.name] = event.target.value;
            this.setState(stateEvent);
        },

        componentDidMount: function() {
          document.addEventListener("eventEdited", this.editEvent);
        },

        render: function () {
            return (
                <form style={this.state.style} onSubmit={this.saveEvent}>
                    <input type="text" name="title" value={this.state.event.title} onChange={this.updateEvent}/>
                    <input type="date" name="date" value={this.state.event.date} onChange={this.updateEvent}/>
                    <textarea name="text" value={this.state.event.text} onChange={this.updateEvent}/>
                    <button>add</button>
                </form>
            );
        }
    });

    React.render(<Timeline/>, document.getElementById("main"));
    React.render(<EventForm/>, document.getElementById("form"));
}());
