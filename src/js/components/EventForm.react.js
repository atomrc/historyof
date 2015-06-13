/*global module, require*/
(function () {
    "use strict";
    var React = require("react"),
        DatePicker = require("react-datepicker"),
        eventActions = require("../actions/eventActions"),
        editedEventStore = require("../stores/editedEventStore"),
        eventTypes = require("../config/eventTypes"),
        moment = require("moment");

    var EventForm = React.createClass({

        getInitialState: function() {
            return {
                event: editedEventStore.getEditedEvent(),
                isEditing: editedEventStore.isEditing()
            };
        },

        componentWillMount: function () {
            editedEventStore.addChangeListener(this.onEditedEventChange);
        },

        componentWillUnmount: function () {
            editedEventStore.removeChangeListener(this.onEditedEventChange);
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
            date = date.toDate();
            date.setHours(prevDate.getHours());
            date.setMinutes(prevDate.getMinutes());
            changes.event.date = date;

            this.setState(changes);
        },

        save: function (e) {
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
            if (!this.state.isEditing) { return (<span></span>); }

            var event = this.state.event,
                type = eventTypes.getType(event.type) || {};

            var typeOptions = eventTypes.getTypes().map(function (eventType) {
                return ((
                    <option value={eventType.name} key={eventType.name}>{eventType.name}</option>
                ));
            });

            return (
                <div id="event-form">
                    <div className="header">
                        <i className={"fa " + type.icon}></i> {event.title || "New Event"}
                        <button type="button" onClick={this.cancel} className="cancel-button"><i className="fa fa-times"></i></button>
                    </div>
                    <form onSubmit={this.save}>
                        <input type="text" placeholder="Title" name="title" value={event.title || ""} onChange={this.onChange} autoComplete="off"/>
                        <select value={event.type} name="type" onChange={this.onChange}>{typeOptions}</select>
                        <br/>
                        <DatePicker onChange={this.dateChange} selected={moment(this.state.event.date)}/>
                        <br/>
                        <textarea rows="8" name="description" placeholder="Description" value={event.description || ""} onChange={this.onChange}/>
                        <br/>
                        <button className="flat-button">add</button>
                    </form>
                </div>
            );
        }
    });

    module.exports = EventForm;
}());
