(function () {
    "use strict";
    var React = require("react"),
        appDispatcher = require("../dispatcher/appDispatcher");

    var EventForm = React.createClass({

        getInitialState: function() {
            return { event: {} };
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
            appDispatcher.dispatch("create", event);
        },

        render: function () {
            var style = { display: "none" };
            if (Object.keys(this.state.event).length !== 0) {
                style.display = "block";
            }

            return (
                <form style={style} onSubmit={this.save}>
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
