(function () {
    "use strict";
    var React = require("react"),
        eventActions = require("../dispatcher/eventActions"),
        appDispatcher = require("../dispatcher/appDispatcher"),
        eventTypes = require("../config/eventTypes");

    var EventForm = React.createClass({

        getInitialState: function() {
            return { event: {} };
        },

        componentDidMount: function () {
            document.addEventListener("edit", function (e) {
                this.setState({ event: e.detail });
            }.bind(this));
        },

        componentWillReceiveProps: function (nextProp) {
            this.setState({ event: nextProp.event });
        },

        onChange: function (e) {
            var changes = { event: this.state.event };
            changes.event[e.target.name] = e.target.value;
            this.setState(changes);
        },

        save: function (e) {
            e.preventDefault();
            var event = this.state.event;
            event.date = new Date(event.date);
            this.replaceState(this.getInitialState());

            var action = event.id ? eventActions.update : eventActions.create;
            appDispatcher.dispatch(action, event);
        },

        cancel: function () {
            this.replaceState(this.getInitialState());
        },

        render: function () {
            var style = { display: "none" },
                event = this.state.event,
                type = eventTypes.getType(event.type);

            if (!type) { return (<span></span>); }

            return (
                <div id="event-form">
                    <div className="header">
                        <i className={"fa " + type.icon}></i> {event.title || "New Event"}
                        <button type="button" onClick={this.cancel} className="cancel-button"><i className="fa fa-times"></i></button>
                    </div>
                    <form onSubmit={this.save}>
                        <input type="text" placeholder="Title" name="title" value={event.title || ""} onChange={this.onChange} autoComplete="off"/>
                        <br/>
                        <input type="date" placeholder="Date" name="date" value={event.date} onChange={this.onChange} autoComplete="off"/>
                        <br/>
                        <textarea rows="8" name="text" placeholder="Description" value={event.text || ""} onChange={this.onChange}/>
                        <br/>
                        <button>add</button>
                    </form>
                </div>
            );
        }
    });

    module.exports = EventForm;
}());
