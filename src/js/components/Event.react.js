(function () {
    "use strict";
    var React = require("react"),
        moment = require("moment"),
        eventActions = require("../actions/eventActions"),
        PureRenderMixin = require("react/addons").addons.PureRenderMixin,
        eventTypes = require("../config/eventTypes");

    var Event = React.createClass({

        mixins: [PureRenderMixin],

        getInitialState: function () {
            return { open: false };
        },

        toggle: function () {
            this.setState({ open: !this.state.open });
        },

        edit: function (e) {
            eventActions.edit(this.props.event);
        },

        remove: function (e) {
            e.stopPropagation();
            if (window.confirm("confirm delete?")) {
                eventActions.remove(this.props.event);
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
                                <strong>{event.title || (event.description || "").substr(0, 40).concat("...")}</strong>
                            </div>
                            <div className="actions cell">
                                <a onClick={this.edit}>E</a>&nbsp;
                                <a onClick={this.remove}>R</a>
                            </div>
                        </div>
                    </header>
                    <p className={"toggle " + classes} dangerouslySetInnerHTML={{__html: (event.description || "").replace(/\n/g, "<br>")}}></p>
                </div>
            );
        }
    });

    module.exports = Event;
}());
