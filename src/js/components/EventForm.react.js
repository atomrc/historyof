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
                <div id="form-container" className={classes}>
                    <form id="event-form" onSubmit={this.save}>
                        <div>
                            <input
                                type="text"
                                placeholder="Title"
                                name="title"
                                value={event.title || ""}
                                onChange={this.onChange}
                                autoComplete="off"/>
                        </div>
                        <div>
                            <Pikaday onChange={this.dateChange} value={event.date}/>
                        </div>
                        <div>
                            <textarea
                                rows="2"
                                name="description"
                                placeholder="Your Story"
                                value={event.description || ""}
                                onChange={this.onChange}
                                onFocus={this.startEditing}/>

                        </div>
                        <div className="actions">
                            <a href="javascript:void(0)" onClick={this.cancel}>cancel</a>&nbsp;
                            <button className="flat-button">{ event.id ? "save" : "add" }</button>
                        </div>
                    </form>
                </div>
            );
        }
    });

    module.exports = EventForm;
}());
