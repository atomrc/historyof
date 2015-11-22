/*global require, module*/
var React = require("react"),
    connect = require("react-redux").connect,
    Timeline = require("../Timeline.react"),
    eventActions = require("../../actions/eventActions");

/**
 * Will handle and display all the events of the timeline
 *
 * @return {undefined}
 */
var TimelineContainer = React.createClass({

    componentWillMount: function () {
        let { dispatch, token } = this.props;
        dispatch(eventActions.getAll(token));
    },

    handleEditEvent: function (event) {
        this.props.dispatch(eventActions.edit(event));
    },

    handleSaveEvent: function (event) {
        let {dispatch, token} = this.props;

        return event.id ?
            dispatch(eventActions.update(token, event)) :
            dispatch(eventActions.create(token, event));
    },

    render: function render() {
        let { user, events } = this.props;

        if (!events.length) {
            return (<div>loading...</div>);
        }

        return (
            <Timeline
                user={user}
                events={events}
                onEditEvent={this.handleEditEvent}
                onSaveEvent={this.handleSaveEvent}
            />
        );
    }
});


function select(state) {
    return {
        user: state.user,
        events: state.events,
        token: state.token
    }
}

module.exports = connect(select)(TimelineContainer);
