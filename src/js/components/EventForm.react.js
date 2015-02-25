(function () {
    "use strict";
    var React = require("react"),
        eventActions = require("../dispatcher/eventActions"),
        appDispatcher = require("../dispatcher/appDispatcher");

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
            var style = { display: "none" };
            if (Object.keys(this.state.event).length !== 0) {
                style.display = "block";
            }

            return (
                <form id="event-form" style={style} onSubmit={this.save}>
                    <input type="text" name="title" value={this.state.event.title || ""} onChange={this.onChange}/>
                    <br/>
                    <input type="date" name="date" value={this.state.event.date} onChange={this.onChange}/>
                    <br/>
                    <textarea name="text" value={this.state.event.text || ""} onChange={this.onChange}/>
                    <br/>
                    <button>add</button>
                    <button type="button" onClick={this.cancel}>cancel</button>
                </form>
            );
        }
    });

    module.exports = EventForm;
}());
