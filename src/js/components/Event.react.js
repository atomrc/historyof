(function () {
    "use strict";
    var React = require("react"),
        moment = require("moment"),
        appDispatcher = require("../dispatcher/appDispatcher"),
        eventActions = require("../dispatcher/eventActions"),
        PureRenderMixin = require('react/addons').addons.PureRenderMixin,
        eventTypes = require("../config/eventTypes");

    var Event = React.createClass({

        mixins: [PureRenderMixin],

        getInitialState: function () {
            return { open: false };
        },

        requestEdition: function (e) {
            e.stopPropagation();
            return this.props.onRequestEdition && this.props.onRequestEdition(this.props.event);
        },

        toggle: function () {
            this.setState({ open: !this.state.open });
        },

        remove: function (e) {
            e.stopPropagation();
            if (window.confirm("confirm delete?")) {
                appDispatcher.dispatch(eventActions.remove, this.props.event);
            }
        },

        render: function () {
            var event = this.props.event,
                classes = this.state.open ? "" : "closed",
                icon = (eventTypes.getType(this.props.event.type) || {}).icon;

            if (event.frontId) {
                classes += " saving";
            }

            return (
                <div className={"event " + classes}>
                    <header onClick={this.toggle}>
                        <div className="infos table">
                            <div className="cell">
                                <a name={ "events/" + event.id }>
                                    <i className={"fa " + icon}></i>
                                </a>
                            </div>
                            <div className="cell">
                                <em className="date">
                                    {moment(event.date).format("DD MMM")}
                                </em>
                            </div>
                            <div className="cell">
                                <strong>{event.title || (event.text || "").substr(0, 40).concat("...")}</strong>
                            </div>
                            <div className="actions cell">
                                <a onClick={this.requestEdition}>E</a>&nbsp;
                                <a onClick={this.remove}>R</a>
                            </div>
                        </div>
                    </header>
                    <p className={"toggle " + classes} dangerouslySetInnerHTML={{__html: (event.text || "").replace(/\n/g, "<br>")}}></p>
                </div>
            );
        }
    });

    module.exports = Event;
}());
