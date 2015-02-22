(function () {
    "use strict";
    var React = require("react"),
        moment = require("moment"),
        eventManager = require("../event/manager"),
        eventEvents = require("../event/event-events"),
        eventTypes = require("../config/event-types");

    var Event = React.createClass({
        getInitialState: function () {
            return {
                event: this.props.event,
                open: false
            };
        },

        setEventListeners: function (up)
        {
            var listeners = {};
            listeners[eventEvents.updated] = this.update;
            eventManager.setEventListeners(listeners, up);
        },

        componentDidMount: function() {
          this.setEventListeners(true);
        },

        componentWillUnmount: function () {
            this.setEventListeners(false);
        },

        toggle: function () {
            this.setState({ open: !this.state.open });
        },

        edit: function () {
            eventManager.dispatchEvent(eventEvents.request.update, this.state.event);
        },

        remove: function () {
            eventManager.dispatchEvent(eventEvents.request.remove, this.state.event);
        },

        update: function (e) {
            var updatedEvent = e.detail;
            if (updatedEvent.id === this.state.event.id) {
                this.setState({ event: updatedEvent });
            }
        },

        render: function () {
            var icon = (eventTypes.getType(this.state.event.type) || {}).icon;

            var classes = this.state.open ? "" : "closed";

            return (
                <div className={"event " + classes}>
                    <header>
                        <span className="title-bar" onClick={this.toggle}>
                            <span>
                                <i className={"fa " + icon}></i>&nbsp;
                                <em>{moment(this.state.event.date).format("DD-MM-YYYY")}</em> -&nbsp;
                                <strong>{this.state.event.title}</strong>
                            </span>
                        </span>
                        <span className="actions">
                            <a href="#" onClick={this.edit}><i className="fa fa-pencil"></i></a>&nbsp;
                            <a href="#" onClick={this.remove}><i className="fa fa-times"></i></a>
                        </span>
                    </header>
                    <p className={"toggle " + classes} dangerouslySetInnerHTML={{__html: this.state.event.text.replace(/\n/g, "<br>")}}></p>
                </div>
            );
        }
    });

    module.exports = Event;
}());
