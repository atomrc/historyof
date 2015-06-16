/*global module, require*/
(function () {
    "use strict";
    var React = require("react"),
        eventActions = require("../actions/eventActions"),
        Pikaday = require("./Pikaday.react"),
        editedEventActions = require("../actions/editedEventActions"),
        editedEventStore = require("../stores/editedEventStore");

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
            var target = e.target;
            var updates = {};
            updates[target.name] = target.value;

            editedEventActions.update(updates);
        },

        dateChange: function (timestamp) {
            editedEventActions.update({ date: new Date(+timestamp) });
        },

        startEditing: function () {
            if (this.state.isEditing) {
                return;
            }
            editedEventActions.update({ date: new Date() });
        },

        save: function (e) {
            e.preventDefault();
            var event = this.state.event;

            return event.id ?
                eventActions.update(event) :
                eventActions.create(event);
        },

        cancel: function () {
            eventActions.cancelEdit();
        },

        render: function () {
            if (!this.state.isEditing) { return (<span></span>); }

            var event = this.state.event;

            return (
                <div id="event-form">
                    <div className="header">
                        {event.title || "New Event"}
                        <button type="button" onClick={this.cancel} className="cancel-button"><i className="fa fa-times"></i></button>
                    </div>
                    <form onSubmit={this.save}>
                        <input type="text" placeholder="Title" name="title" value={event.title || ""} onChange={this.onChange} autoComplete="off"/>
                        <br/>
                        <Pikaday onChange={this.dateChange} value={event.date}/>
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
