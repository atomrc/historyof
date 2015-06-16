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
            var event = this.state.event,
                classes = this.state.isEditing ?
                    "active":
                    "";

            return (
                <div id="form-container">
                    <form id="event-form" className={classes} onSubmit={this.save}>
                        <input
                            type="text"
                            placeholder="Add a title"
                            name="title"
                            value={event.title || ""}
                            onChange={this.onChange}
                            autoComplete="off"/>
                        <br/>
                        <textarea
                            rows="2"
                            name="description"
                            placeholder="Tell me your story"
                            value={event.description || ""}
                            onChange={this.onChange}
                            onFocus={this.startEditing}/>

                        <br/>
                        <Pikaday onChange={this.dateChange} value={event.date}/>
                        <br/>
                        <button className="flat-button">{ event.id ? "save" : "add" }</button>
                    </form>
                </div>
            );
        }
    });

    module.exports = EventForm;
}());
