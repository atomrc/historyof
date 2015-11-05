/*global require, module*/
var React = require("react"),
    Component = React.Component,
    Container = require("flux/utils").Container,
    Timeline = require("../Timeline.react"),
    eventActions = require("../../actions/eventActions");

var eventStore = require("../../stores/storeFactory").get("eventsStore");
/**
 * Will handle and display all the events of the timeline
 *
 * @return {undefined}
 */
class TimelineContainer extends Component {

    constructor() {
        eventActions.getAll();
        super();
    }

    static getStores() {
        return [eventStore];
    }

    static calculateState() {
        return {
            events: eventStore.get()
        };
    }

    render() {
        if (!this.state.events) {
            return (<div>loading...</div>);
        }

        return (
            <Timeline user={this.props.user} events={this.state.events}/>
        );
    }
}

module.exports = Container.create(TimelineContainer);
