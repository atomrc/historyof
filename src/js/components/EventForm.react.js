(function () {
    "use strict";
    var React = require("react"),
        DatePicker = require('react-datepicker-component/DatePicker.jsx'),
        DatePickerInput = require('react-datepicker-component/DatePickerInput.jsx'),
        eventActions = require("../actions/eventActions"),
        editedEventStore = require("../stores/editedEventStore"),
        eventTypes = require("../config/eventTypes");

    var EventForm = React.createClass({

        getInitialState: function() {
            return { event: editedEventStore.getEditedEvent() };
        },

        componentDidMount: function () {
            editedEventStore.addChangeListener(this.onEditedEventChange);
        },

        onEditedEventChange: function () {
            this.setState(this.getInitialState());
        },

        onChange: function (e) {
            var changes = { event: this.state.event };
            changes.event[e.target.name] = e.target.value;
            this.setState(changes);
        },

        dateChange: function (date) {
            var changes = { event: this.state.event },
                prevDate = this.state.event.date;
            date.setHours(prevDate.getHours());
            date.setMinutes(prevDate.getMinutes());
            changes.event["date"] = date;

            this.setState(changes);
        },

        create: function (e) {
            e.preventDefault();
            var event = this.state.event;
            event.date = new Date(event.date);
            this.replaceState(this.getInitialState());

            return event.id ?
                eventActions.update(event) :
                eventActions.create(event);
        },

        cancel: function () {
            eventActions.cancelEdit();
        },

        render: function () {
            var style = { display: "none" },
                event = this.state.event,
                type = eventTypes.getType(event.type) || {};

            if (!this.state.event.date) { return (<span></span>); }

            var typeOptions = eventTypes.getTypes().map(function (type) {
                return ((
                    <option value={type.name}>{type.name}</option>
                ));
            });

            return (
                <div id="event-form">
                    <div className="header">
                        <i className={"fa " + type.icon}></i> {event.title || "New Event"}
                        <button type="button" onClick={this.cancel} className="cancel-button"><i className="fa fa-times"></i></button>
                    </div>
                    <form onSubmit={this.create}>
                        <input type="text" placeholder="Title" name="title" value={event.title || ""} onChange={this.onChange} autoComplete="off"/>
                        <select value={event.type} name="type" onChange={this.onChange}>{typeOptions}</select>
                        <br/>
                        <DatePickerInput classNamePrefix="wide-datepicker" date={event.date} onChangeDate={this.dateChange}/>
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
