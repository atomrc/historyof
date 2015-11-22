/*global module, require*/
var React = require("react"),
    connect = require("react-redux").connect,
    eventActions = require("../actions/eventActions"),
    Pikaday = require("./Pikaday.react"),
    editedEventActions = require("../actions/editedEventActions");

var EventForm = React.createClass({

    handleChange: function (e) {
        var target = e.target;
        var updates = {};
        updates[target.name] = target.value;

        this.props.dispatch(editedEventActions.update(updates));
    },

    handleDateChange: function (timestamp) {
        this.props.dispatch(editedEventActions.update({ date: new Date(+timestamp) }));
    },

    handleSave: function (e) {
        e.preventDefault();
        let {event, onSave} = this.props;
        return onSave(event);
    },

    handleCancel: function () {
        this.props.dispatch(eventActions.cancelEdit());
    },

    render: function () {
        let { event, isEditing } = this.props;
        let classes = isEditing ?  "active" : "";

        return (
            <div id="form-container" className={classes}>
                <form id="event-form" onSubmit={this.handleSave}>
                    <div>
                        <input
                            type="text"
                            placeholder="Title"
                            name="title"
                            value={event.title || ""}
                            onChange={this.handleChange}
                            autoComplete="off"/>
                    </div>
                    <div>
                        <Pikaday onChange={this.handleDateChange} value={event.date}/>
                    </div>
                    <div>
                        <textarea
                            rows="2"
                            name="description"
                            placeholder="Your Story"
                            value={event.description || ""}
                            onChange={this.handleChange}/>

                    </div>
                    <div className="actions">
                        <a href="javascript:void(0)" onClick={this.handleCancel}>cancel</a>&nbsp;
                        <button className="flat-button">{ event.id ? "save" : "add" }</button>
                    </div>
                </form>
            </div>
        );
    }
});

EventForm.PropTypes = {
    onSave: React.PropTypes.func.isRequired
};

function select(state) {
    return {
        event: state.editedEvent,
        isEditing: state.isEditing
    }
}
module.exports = connect(select)(EventForm);
